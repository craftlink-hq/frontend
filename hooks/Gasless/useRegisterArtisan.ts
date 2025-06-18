"use client";

import { useCallback } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isSupportedChain } from "@/constants/chain";
import { useStoreIPFS } from "@/utils/store";
import { useLoading } from "../useLoading";

export const useRegisterArtisan = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { ipfsUrl } = useStoreIPFS();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const registerAsArtisan = useCallback(
    async () => {
      if (!isConnected || !address) {
        toast.warning("Please connect your wallet first.");
        return false;
      }
      if (!isSupportedChain(chainId)) {
        toast.warning("Unsupported network. Please switch to the correct network.");
        return false;
      }
      if (!ipfsUrl) {
        toast.error("IPFS hash is required");
        return false;
      }

      startLoading();
      try {
        const functionName = "registerAsArtisan";
        const params = { ipfsUrl };
        const gaslessMessage = JSON.stringify({ functionName, user: address, params });
        const gaslessSignature = await signMessageAsync({ message: gaslessMessage });

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
          toast.success("Registered as artisan successfully");
          router.push("/role/artisans/onboarding/category")
          return true;
        } else {
          toast.error(`Error: ${result.message}`);
          return false;
        }
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
          return false;
        } else {
          toast.error("Error during artisan registration");
          console.error(error);
          return false;
        }
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, isConnected, chainId, signMessageAsync, router, ipfsUrl]
  );

  return { registerAsArtisan, isLoading };
};