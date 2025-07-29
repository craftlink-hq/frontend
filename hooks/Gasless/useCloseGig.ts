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

export const useCloseGig = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const RELAYER_URL = process.env.RELAYER_URL;

  const closeGig = useCallback(async (databaseId: string) => {
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

      const functionName = "closeGig";
      const params = { databaseId };
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
        toast.success("Gig closed successfully and the funds have been refunded.");
        router.push("/manage-jobs/clients/closed");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error: unknown) {
      const err = error as ErrorWithReason;
      let errorMessage = "Request cancelled.";

        if (err.reason === "Not gig owner") {
                errorMessage = "You are not the owner of this gig.";
        } else if (err.reason === "Cannot close active gig") {
            errorMessage = "You cannot close an active gig.";
        } else if (err.reason === "Gig already Completed || Closed") {
            errorMessage = "This gig has already been completed or closed.";
        } else if (err.reason === "Invalid gig ID") {
            errorMessage = "This gig is invalid or does not exist.";
        } else {
            errorMessage = err.message || "Transaction failed";
        }

        toast.error(errorMessage);
        console.error("Close gig error:", error);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, isConnected, chainId, signMessageAsync]);

  return { closeGig, isLoading };
};