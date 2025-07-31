"use client";

import { useCallback } from "react";
import { useAccount, useChainId, useSignMessage } from "@/lib/thirdweb-hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isSupportedChain } from "@/constants/chain";
import { useLoading } from "../useLoading";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

export const useArtisanSubmitReview = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const RELAYER_URL = process.env.RELAYER_URL;

  const artisanSubmitReview = useCallback(
    async (databaseId: string, rating: number, commentHash: string) => {
      if (!isConnected || !address) {
        toast.warning("Please connect your wallet first.");
        return false;
      }
      if (!isSupportedChain(chainId)) {
        toast.warning("Unsupported network. Please switch to the correct network.");
        return false;
      }
      if (!databaseId) {
        toast.error("Database ID is required");
        return false;
      }
      if (rating < 1 || rating > 5) {
        toast.error("Rating must be between 1 and 5");
        return false;
      }
      if (!commentHash) {
        toast.error("Comment hash is required");
        return false;
      }

      startLoading();
      try {
        if (!RELAYER_URL) {
          throw new Error("Relayer URL is not defined");
        }

        const nonceResponse = await fetch(`${RELAYER_URL}/nonce/${address}`);
        const { nonce } = await nonceResponse.json();

        const functionName = "submitReview";
        const params = { databaseId, rating, commentHash };
        const gaslessMessage = JSON.stringify({ functionName, user: address, params, nonce });
        const gaslessSignature = await signMessageAsync(gaslessMessage);

        const response = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName,
            user: address,
            params,
            signature: gaslessSignature,
            nonce,
          }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Review submitted successfully");
          router.push("/manage-jobs/artisans");
          return true;
        } else {
          toast.error(`Error: ${result.message}`);
          return false;
        }
      } catch (error: unknown) {
        const err = error as ErrorWithReason;
        let errorMessage = "Error during review submission";

        if (err.reason === "Rating must be between 1 and 5") {
          errorMessage = "Rating must be between 1 and 5";
        } else if (err.reason === "Only the hired artisan can submit a client review") {
          errorMessage = "Only the hired artisan can submit a review";
        } else if (err.reason === "Gig must be completed before submitting a review") {
          errorMessage = "Gig must be completed before submitting a review";
        } else if (err.reason === "Cannot review a closed gig") {
          errorMessage = "Cannot review a closed gig";
        } else if (err.message?.includes("User rejected")) {
          errorMessage = "Signature request cancelled";
        } else {
          errorMessage = err.message || "Transaction failed";
        }

        toast.error(errorMessage);
        console.error("Review submission error:", error);
        return false;
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [address, isConnected, chainId, signMessageAsync, router, RELAYER_URL]
  );

  return { artisanSubmitReview, isLoading };
};