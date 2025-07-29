"use client";

import { useCallback } from "react";
import { useAccount, useChainId, useSignMessage } from "@/lib/thirdweb-hooks";
import { toast } from "sonner";
import { isSupportedChain } from "@/constants/chain";
import { useLoading } from "../useLoading";
import { useRouter } from "next/navigation";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

export const useArtisanSubmitReview = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const RELAYER_URL = process.env.RELAYER_URL;

  const artisanSubmitReview = useCallback(async (databaseId: string, rating: number, comment: string) => {
    if (!isConnected || !address) {
      toast.warning("Please connect your wallet first.");
      return;
    }
    if (!isSupportedChain(chainId)) {
      toast.warning("Unsupported network. Please switch to the correct network.");
      return;
    }

    startLoading();
    try {
      if (!RELAYER_URL) {
        throw new Error("Relayer URL is not defined");
      }

      const nonceResponse = await fetch(`${RELAYER_URL}/nonce/${address}`);
      const { nonce } = await nonceResponse.json();

      const functionName = "artisanSubmitReview";
      const params = { address, databaseId, rating, comment };
      const gaslessMessage = JSON.stringify({ functionName, user: address, params, nonce });
      const gaslessSignature = await signMessageAsync(gaslessMessage);

      toast.message("Please wait while we process your transaction.");

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
        toast.success("Review submitted successfully.");
        router.push("/manage-jobs/artisans");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error: unknown) {
      const err = error as ErrorWithReason;
      let errorMessage = "Request cancelled.";

      if (err.reason === "Rating must be between 1 and 5") {
        errorMessage = "Please enter a valid value between 1 to 5.";
      } else if (err.reason === "Only the hired artisan can submit a client review") {
        errorMessage = "You are not the hired artisan for this gig.";
      } else if (err.reason === "Gig must be completed before submitting a review") {
        errorMessage = "This gig is not yet completed.";
      } else if (err.reason === "Cannot review a closed gig") {
        errorMessage = "A closed gig cannot be reviewed.";
      } else {
        errorMessage = err.message || "Transaction failed";
      }

      toast.error(errorMessage);
      console.error("Review submission error:", error);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected, chainId, signMessageAsync, router, RELAYER_URL]);

  return { artisanSubmitReview, isLoading };
};