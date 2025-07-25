"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ethers, formatEther } from "ethers";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { getCraftCoinContract, getGigContract } from "@/constants/contracts";
import { useLoading } from "../useLoading";
import { useSignMessage } from "@/lib/thirdweb-hooks";
import { useChainSwitch } from "../useChainSwitch";
import { thirdwebClient } from "@/app/client";
import { liskSepolia } from "@/constants/chain";

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
}

const useApplyForGig = () => {
  const account = useActiveAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const RELAYER_URL = process.env.RELAYER_URL;
  const { ensureCorrectChain } = useChainSwitch();

  const applyForGig = useCallback(
    async (databaseId: string) => {
      if (typeof window === 'undefined') {
        return false;
      }

      if (!account) {
        toast.warning("Please connect your wallet first.");
        return false;
      }
      
      const isCorrectChain = await ensureCorrectChain();
      if (!isCorrectChain) {
        return false;
      }

      startLoading();
      
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc.sepolia-api.lisk.com");

        // Fetch required CFT for the gig
        const gigContract = getGigContract(provider);
        const requiredCFT = await gigContract.getRequiredCFT(databaseId);
        const formattedCFT = Number(formatEther(requiredCFT));

        // Fetch user's CFT balance
        const craftCoinContract = getCraftCoinContract(provider);
        const cftResp = await craftCoinContract.balanceOf(account.address);
        const cftBalance = Number(formatEther(cftResp));

        if (cftBalance < formattedCFT) {
          toast.error("Insufficient CFT balance to apply for this gig.");
          return false;
        }

        // Option 1: Try to use gasless with permit signing
        try {
          if (typeof window === 'undefined') {
            throw new Error("Not in browser environment");
          }
          
          const ethereum = (window as any)?.ethereum as EthereumProvider;
          
          if (!ethereum?.request) {
            throw new Error("No compatible wallet provider found");
          }

          try {
            const nonce = await craftCoinContract.nonces(account.address);
            const name = await craftCoinContract.name();
            const version = await craftCoinContract.version?.() ?? "1";
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
                verifyingContract: process.env.CRAFT_COIN as string,
              },
              message: {
                owner: account.address,
                spender: process.env.GIG_MARKET_PLACE as string,
                value: requiredCFT.toString(),
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
              databaseId,
              deadline: deadline.toString(),
              v,
              r,
              s,
            };

            const functionName = "applyForGig";
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
              toast.success("Application Submitted");
              router.push("/manage-jobs/artisans");
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
          const craftCoinThirdwebContract = getContract({
            client: thirdwebClient,
            chain: liskSepolia,
            address: process.env.CRAFT_COIN as string,
          });

          const gigThirdwebContract = getContract({
            client: thirdwebClient,
            chain: liskSepolia,
            address: process.env.GIG_MARKET_PLACE as string,
          });

          // First, approve the spending
          const approveTransaction = prepareContractCall({
            contract: craftCoinThirdwebContract,
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [process.env.GIG_MARKET_PLACE as string, requiredCFT.toString()],
          });

          toast.message("Please approve CFT spending...");
          await sendTransaction({ transaction: approveTransaction, account });

          // Then apply for the gig
          const applyTransaction = prepareContractCall({
            contract: gigThirdwebContract,
            method: "function applyForGig(string memory databaseId)",
            params: [databaseId],
          });

          toast.message("Applying for gig...");
          await sendTransaction({ transaction: applyTransaction, account });

          toast.success("Application Submitted");
          router.push("/manage-jobs/artisans");
          return true;
        }

      } catch (error: unknown) {
        console.error("Application error:", error);
        
        if ((error as Error).message.includes("User rejected") || 
            (error as Error).message.includes("rejected")) {
          toast.info("Transaction cancelled by user");
        } else {
          toast.error("Error during application");
        }
        return false;
      } finally {
        stopLoading();
      }
    },
    [account, ensureCorrectChain, signMessageAsync, router, RELAYER_URL]
  );

  return { applyForGig, isLoading };
};

export default useApplyForGig;