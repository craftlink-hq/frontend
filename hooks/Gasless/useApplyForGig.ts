"use client";

import { useCallback } from "react";
import { useAccount, useChainId, useSignMessage, useSignTypedData, usePublicClient, useWalletClient } from "wagmi";
import { toast } from "sonner";
import { ethers, formatEther } from "ethers";
import { useRouter } from "next/navigation";
import { getCraftCoinContract, getGigContract } from "@/constants/contracts";
import { isSupportedChain } from "@/constants/chain";
import { useAppKitProvider, type Provider } from "@reown/appkit/react";
import { Address } from "viem";
import { useLoading } from "../useLoading";

const useApplyForGig = () => {
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

  const applyForGig = useCallback(
    async (databaseId: string) => {
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

      startLoading();
      try {
        const provider = getProviderSafely();

        // Add retry logic and better error handling for contract calls
        let requiredCFT, cftResp;
        let retryCount = 0;
        const maxRetries = 3;

        let nonce, name, version;

        while (retryCount < maxRetries) {
          try {
            // Fetch required CFT for the gig
            const gigContract = getGigContract(provider);
            requiredCFT = await gigContract.getRequiredCFT(databaseId);
            
            // Fetch user's CFT balance
            const craftCoinContract = getCraftCoinContract(provider);
            cftResp = await craftCoinContract.balanceOf(address);

            nonce = await craftCoinContract.nonces(address);
            name = await craftCoinContract.name();
            version = await craftCoinContract.version?.() ?? "1";
            break; // Success, exit retry loop
          } catch (contractError: unknown) {
            retryCount++;
            console.warn(`Contract call attempt ${retryCount} failed:`, contractError);
            
            if (retryCount === maxRetries) {
              // If all retries failed, check if it's a network issue
              if ((contractError as Error).message?.includes('missing revert data') || 
                  (contractError as Error).message?.includes('CALL_EXCEPTION') ||
                  (contractError as Error).message === 'CALL_EXCEPTION') {
                toast.error("Network error. Please check your connection and try again.");
                return false;
              }
              throw contractError;
            }
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }

        const formattedCFT = Number(formatEther(requiredCFT));
        const cftBalance = Number(formatEther(cftResp));

        if (cftBalance < formattedCFT) {
          toast.error("Insufficient CFT balance to apply for this gig.");
          return;
        }

        // Fetch user's info from CraftCoin contract
        

        // Set deadline (1 hour from now)
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        // Prepare permit message for CraftCoin
        const domain = {
          name: name,
          version: version,
          chainId: chainId,
          verifyingContract: process.env.CRAFT_COIN as Address,
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

        const permitMessage = {
          owner: address,
          spender: process.env.GIG_MARKET_PLACE,
          value: requiredCFT.toString(),
          nonce: nonce.toString(),
          deadline: deadline.toString(),
        };

        // Sign permit message using wagmi hooks (works with social logins)
        let permitSignature;
        try {
          permitSignature = await signTypedDataAsync({
            domain,
            types,
            primaryType: "Permit",
            message: permitMessage,
          });
        } catch (signError: unknown) {
          console.error("Permit signing failed:", signError);
          if ((signError as Error).message?.includes("User rejected")) {
            toast.info("Signature request cancelled");
            return false;
          }
          throw signError;
        }

        // Split permit signature into v, r, s
        const signature = ethers.Signature.from(permitSignature);
        const { v, r, s } = signature;

        // Prepare params for the gasless transaction
        const params = {
          databaseId,
          deadline: deadline.toString(),
          v,
          r,
          s,
        };

        // Prepare gasless transaction message
        const functionName = "applyForGig";
        const gaslessMessage = JSON.stringify({ functionName, user: address, params });

        // Sign the gasless transaction message using wagmi (works with social logins)
        let gaslessSignature;
        try {
          gaslessSignature = await signMessageAsync({ message: gaslessMessage });
        } catch (signError: unknown) {
          console.error("Gasless message signing failed:", signError);
          if ((signError as Error).message?.includes("User rejected")) {
            toast.info("Signature request cancelled");
            return false;
          }
          throw signError;
        }

        // Send request to the relayer backend
        if (!RELAYER_URL) {
          throw new Error("Relayer URL is not defined");
        }
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

        const result = await response.json();
        if (result.success) {
          toast.success("Application Submitted");
          router.push("/manage-jobs/artisans");
        } else {
          toast.error(`Error: ${result.message}`);
        }

        return true;
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
        } else {
          toast.error("Error during application");
          console.error(error);
        }

        return false;
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, isConnected, chainId, signTypedDataAsync, signMessageAsync, walletProvider, walletClient, publicClient, router]
  );

  return { applyForGig, isLoading };
};

export default useApplyForGig;