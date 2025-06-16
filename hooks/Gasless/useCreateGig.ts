"use client";

import { useCallback, useState } from "react";
import { useAccount, useChainId, useSignMessage, useSignTypedData } from "wagmi";
import { toast } from "sonner";
import { ethers, Signature } from "ethers";
import { useRouter } from "next/navigation";
import { getTokenContract } from "@/constants/contracts";
import { getProvider } from "@/constants/providers";
import { isSupportedChain } from "@/constants/chain";
import { useAppKitProvider, type Provider } from "@reown/appkit/react";
import { Address } from "viem";

const useCreateGig = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();
  const { signMessageAsync } = useSignMessage();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createGig = useCallback(
    async (rootHash: string, databaseId: string, budget: number) => {
      if (!isConnected || !address) {
        toast.warning("Please connect your wallet first.");
        return;
      }
      if (!isSupportedChain(chainId)) {
        toast.warning("Unsupported network. Please switch to the correct network.");
        return;
      }

      setIsLoading(true);
      try {
        const provider = getProvider(walletProvider);
        const tokenContract = getTokenContract(provider);

        // Fetch nonce from token contract
        const nonce = await tokenContract.nonces(address);

        // Set deadline (1 hour from now)
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        // Prepare permit message for USDT approval
        const domain = {
          name: "USD Tethers",
          version: "1",
          chainId: chainId,
          verifyingContract: process.env.TOKEN as Address,
        };

        const types = {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        };

        // Convert budget to smallest unit (USDT has 6 decimals)
        const value = ethers.parseUnits(budget.toString(), 6);

        const permitMessage = {
          owner: address,
          spender: process.env.PAYMENT_PROCESSOR,
          value: value.toString(),
          nonce: nonce.toString(),
          deadline: deadline.toString(),
        };

        // Sign permit message to get signature
        const permitSignature = await signTypedDataAsync({
          domain,
          types,
          primaryType: "Permit",
          message: permitMessage,
        });

        // Split permit signature into v, r, s
        const signature = Signature.from(permitSignature);
        const { v, r, s } = signature;

        // Prepare params for gasless transaction
        const params = {
          rootHash,
          databaseId,
          budget: value.toString(),
          deadline: deadline.toString(),
          v,
          r,
          s,
        };

        // Prepare gasless transaction message
        const functionName = "createGig";
        const gaslessMessage = JSON.stringify({ functionName, user: address, params });

        // Sign gasless transaction message
        const gaslessSignature = await signMessageAsync({ message: gaslessMessage });

        // Send request to backend
        const response = await fetch("http://localhost:3005/gasless-transaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName,
            user: address,
            params,
            signature: gaslessSignature,
          }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Gig created successfully");
          router.push("/manage-jobs/clients");
        } else {
          toast.error(`Error: ${result.message}`);
        }
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
        } else {
          toast.error("Error during gig creation");
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [address, isConnected, chainId, signTypedDataAsync, signMessageAsync, walletProvider, router]
  );

  return { createGig, isLoading };
};

export default useCreateGig;