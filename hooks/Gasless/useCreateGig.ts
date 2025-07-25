"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ethers, formatEther } from "ethers";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { getTokenContract, getPaymentProcessorContract } from "@/constants/contracts";
import { useLoading } from "../useLoading";
import { useSignMessage } from "@/lib/thirdweb-hooks";
import { useChainSwitch } from "../useChainSwitch";
import { thirdwebClient } from "@/app/client";
import { liskSepolia } from "@/constants/chain";

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

const useCreateGig = () => {
  const account = useActiveAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const RELAYER_URL = process.env.RELAYER_URL;
  const { ensureCorrectChain } = useChainSwitch();

  const createGig = useCallback(
    async (rootHash: string, databaseId: string, budget: number) => {
      if (!account) {
        toast.warning("Please connect your wallet first.");
        return false;
      }
      
      const isCorrectChain = await ensureCorrectChain();
      if (!isCorrectChain) {
        return false;
      }

      if (!rootHash || !databaseId || !budget) {
        toast.error("Invalid gig parameters");
        return false;
      }

      startLoading();
      
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia-api.lisk.com");

        // Check user's USDT balance
        const tokenContract = getTokenContract(provider);
        const budgetInWei = ethers.parseUnits(budget.toString(), 6); // USDT has 6 decimals
        const tokenBalance = await tokenContract.balanceOf(account.address);

        if (tokenBalance < budgetInWei) {
          toast.error("Insufficient USDT balance to create this gig.");
          return false;
        }

        // Option 1: Try to use gasless with permit signing
        try {
          const ethereum = (window as any)?.ethereum as EthereumProvider;
          
          if (!ethereum?.request) {
            throw new Error("No compatible wallet provider found");
          }

          try {
            const nonce = await tokenContract.nonces(account.address);
            const name = await tokenContract.name();
            const version = await tokenContract.version?.() ?? "1";
            const deadline = Math.floor(Date.now() / 1000) + 3600;
            const chainId = liskSepolia.id;

            const typedData = {
              types: {
                EIP712Domain: [
                  { name: "name", type: "string" },
                  { name: "version", type: "string" },
                  { name: "chainId", type: "uint256" },
                  { name: "verifyingContract", type: "address" },
                ],
                Permit: [
                  { name: "owner", type: "address" },
                  { name: "spender", type: "address" },
                  { name: "value", type: "uint256" },
                  { name: "nonce", type: "uint256" },
                  { name: "deadline", type: "uint256" },
                ],
              },
              primaryType: "Permit",
              domain: {
                name: name,
                version: version,
                chainId: chainId,
                verifyingContract: process.env.TOKEN as string,
              },
              message: {
                owner: account.address,
                spender: process.env.PAYMENT_PROCESSOR as string,
                value: budgetInWei.toString(),
                nonce: nonce.toString(),
                deadline: deadline.toString(),
              },
            };

            toast.message("Please sign the permit...");
            
            // Use wallet's native signing
            const permitSignature = await ethereum.request({
              method: 'eth_signTypedData_v4',
              params: [account.address, JSON.stringify(typedData)],
            }) as string;

            // Split signature
            const signature = ethers.Signature.from(permitSignature);
            const { v, r, s } = signature;

            // Prepare gasless transaction
            const params = {
              rootHash,
              databaseId,
              budget: budgetInWei.toString(),
              deadline: deadline.toString(),
              v,
              r,
              s,
            };

            const functionName = "createGig";
            const gaslessMessage = JSON.stringify({ functionName, user: account.address, params });
            const gaslessSignature = await signMessageAsync(gaslessMessage);

            // Send to relayer
            if (!RELAYER_URL) {
              throw new Error("Relayer URL is not defined");
            }

            const response = await fetch(`${RELAYER_URL}/gasless-transaction`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                functionName,
                user: account.address,
                params,
                signature: gaslessSignature,
              }),
            });

            const result = await response.json();
            if (result.success) {
              toast.success("Gig created successfully");
              router.push("/manage-jobs/clients"); // or wherever you want to navigate
              return true;
            } else {
              toast.error(`Error: ${result.message}`);
              return false;
            }

          } catch (walletError) {
            console.error("Wallet signing failed:", walletError);
            throw walletError;
          }

        } catch (thirdwebError) {
          console.log("Gasless approach failed, trying direct approach:", thirdwebError);
          
          // Option 2: Fallback to thirdweb's built-in approach
          const tokenThirdwebContract = getContract({
            client: thirdwebClient,
            chain: liskSepolia,
            address: process.env.TOKEN as string,
          });

          const paymentProcessorThirdwebContract = getContract({
            client: thirdwebClient,
            chain: liskSepolia,
            address: process.env.PAYMENT_PROCESSOR as string,
          });

          // First, approve the spending
          const approveTransaction = prepareContractCall({
            contract: tokenThirdwebContract,
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [process.env.PAYMENT_PROCESSOR as string, budgetInWei],
          });

          toast.message("Please approve USDT spending...");
          await sendTransaction({ transaction: approveTransaction, account });

          // Then create the gig
          const createGigTransaction = prepareContractCall({
            contract: paymentProcessorThirdwebContract,
            method: "function createGig(string memory rootHash, string memory databaseId, uint256 budget)",
            params: [rootHash, databaseId, budgetInWei],
          });

          toast.message("Creating gig...");
          await sendTransaction({ transaction: createGigTransaction, account });

          toast.success("Gig created successfully");
          router.push("/manage-jobs/clients"); // or wherever you want to navigate
          return true;
        }

      } catch (error: unknown) {
        console.error("Gig creation error:", error);
        
        if ((error as Error).message.includes("User rejected") || 
            (error as Error).message.includes("rejected")) {
          toast.info("Transaction cancelled by user");
        } else {
          toast.error("Error during gig creation");
        }
        return false;
      } finally {
        stopLoading();
      }
    },
    [account, ensureCorrectChain, signMessageAsync, router, RELAYER_URL]
  );

  return { createGig, isLoading };
};

export default useCreateGig;