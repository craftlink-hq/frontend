"use client";

import { useCallback } from "react";
import { useAccount, useChainId, usePublicClient, useSignMessage, useSignTypedData, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { ethers, Signature } from "ethers";
import { useRouter } from "next/navigation";
import { getTokenContract } from "@/constants/contracts";
// import { getProvider } from "@/constants/providers";
import { isSupportedChain } from "@/constants/chain";
import { useAppKitProvider, type Provider } from "@reown/appkit/react";
import { Address } from "viem";
import { useLoading } from "../useLoading";

const useCreateGig = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signTypedDataAsync } = useSignTypedData();
  const { signMessageAsync } = useSignMessage();
  const { walletProvider } = useAppKitProvider<Provider>("eip155");
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const RELAYER_URL = process.env.RELAYER_URL;

  // Helper function to get provider - fallback to read-only if no wallet provider
  const getProviderSafely = () => {
    if (walletProvider) {
      try {
        return new ethers.BrowserProvider(walletProvider);
      } catch (error) {
        console.warn("Failed to create BrowserProvider from walletProvider:", error);
      }
    }
    
    // Fallback to read-only provider for contract reads
    if (publicClient) {
      try {
        // Extract RPC URL from transport if available
        const rpcUrl = (publicClient.transport)?.url || process.env.RPC_URL;
        return new ethers.JsonRpcProvider(rpcUrl);
      } catch (error) {
        console.warn("Failed to create provider from publicClient:", error);
      }
    }
    
    // Ultimate fallback - create read-only provider with RPC URL
    return new ethers.JsonRpcProvider(process.env.RPC_URL);
  };

  const createGig = useCallback(
    async (rootHash: string, databaseId: string, budget: number) => {
      if (!isConnected || !address) {
        toast.warning("Please connect your wallet first.");
        return false;
      }
      if (!isSupportedChain(chainId)) {
        toast.warning("Unsupported network. Please switch to the correct network.");
        return false;
      }

      // Check if we have wallet client for signing (required for social logins)
      if (!walletClient && !walletProvider) {
        toast.error("Wallet not properly connected. Please reconnect your wallet.");
        return false;
      }

      if (!rootHash || !databaseId || !budget) {
        toast.error("Invalid gig parameters");
        return false;
      }

      startLoading();
      try {
        console.log("Creating gig");
        console.log("Creating gig with parameters:", rootHash, databaseId, budget || 0);
        console.log("Using address:", address);
        const provider = getProviderSafely();
        const tokenContract = getTokenContract(provider);

        // Fetch nonce from token contract
        const nonce = await tokenContract.nonces(address);

        // Set deadline (1 hour from now)
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        const name = await tokenContract.name?.() ?? "USD Tethers";
        const version = await tokenContract.version?.() ?? "1";

        // Prepare permit message for USDT approval
        const domain = {
          name: name,
          version: version,
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
        if (!RELAYER_URL) {
          throw new Error("Relayer URL is not defined");
        }
        console.log("Sending gasless transaction to relayer:");
        const response = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName,
            user: address,
            params,
            signature: gaslessSignature,
          }),
        });

        console.log("Response from relayer:", response);
        const result = await response.json();
        if (result.success) {
          toast.success("Gig created successfully");
          return true;
        } else {
          toast.error(`Error: ${result.message}`);
          return false;
        }
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
        } else {
          toast.error("Error during gig creation");
          console.error(error);
        }
        return false;
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, isConnected, chainId, signTypedDataAsync, signMessageAsync, walletProvider, router]
  );

  return { createGig, isLoading };
};

export default useCreateGig;