"use client";

import { useCallback, useState } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isSupportedChain } from "@/constants/chain";
import { useStoreIPFS } from "@/utils/store";

export const useRegisterArtisan = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { ipfsUrl } = useStoreIPFS();
  const [isLoading, setIsLoading] = useState(false);

  const registerAsArtisan = useCallback(
    async () => {
      if (!isConnected || !address) {
        toast.warning("Please connect your wallet first.");
        return;
      }
      if (!isSupportedChain(chainId)) {
        toast.warning("Unsupported network. Please switch to the correct network.");
        return;
      }
      if (!ipfsUrl) {
        toast.error("IPFS hash is required");
        return;
      }

      setIsLoading(true);
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
          router.push("/profile/artisans");
        } else {
          toast.error(`Error: ${result.message}`);
        }
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
        } else {
          toast.error("Error during artisan registration");
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [address, isConnected, chainId, signMessageAsync, router, ipfsUrl]
  );

  return { registerAsArtisan, isLoading };
};