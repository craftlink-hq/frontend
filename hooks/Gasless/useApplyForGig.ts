"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ethers, formatEther } from "ethers";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { useSignMessage } from "@/lib/thirdweb-hooks";
import { useLoading } from "../useLoading";
import { useChainSwitch } from "../useChainSwitch";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

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
        const provider = new ethers.JsonRpcProvider(
          "https://base-sepolia.g.alchemy.com/v2/7YcyjUTTMHZ7Ff_gdbynvaCPgRB6kL0Q"
        );
        const gigContract = new ethers.Contract(
          process.env.GIG_MARKET_PLACE!,
          ['function getRequiredCFT(bytes32) view returns (uint256)'],
          provider
        );
        const craftCoinContract = new ethers.Contract(
          process.env.CRAFT_COIN!,
          ['function balanceOf(address) view returns (uint256)', 'function allowance(address, address) view returns (uint256)'],
          provider
        );

        const requiredCFT = await gigContract.getRequiredCFT(databaseId);
        const formattedCFT = Number(formatEther(requiredCFT));
        const cftBalance = Number(formatEther(await craftCoinContract.balanceOf(account.address)));

        if (cftBalance < formattedCFT) {
          toast.error("Insufficient CFT balance to apply for this gig.");
          return false;
        }

        if (!RELAYER_URL) {
          throw new Error("Relayer URL is not defined");
        }

        // Fetch nonce for approval
        const approveNonceResponse = await fetch(`${RELAYER_URL}/nonce/${account.address}`);
        const { nonce: approveNonce } = await approveNonceResponse.json();

        // Approve CraftCoin spending
        const approveParams = {
          spender: process.env.GIG_MARKET_PLACE as string,
          amount: requiredCFT.toString(),
        };
        const approveMessage = JSON.stringify({
          functionName: "approveCraftCoin",
          user: account.address,
          params: approveParams,
          nonce: approveNonce,
        });
        const approveSignature = await signMessageAsync(approveMessage);

        toast.message("Approving CFT spending...");
        const approveResponse = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName: "approveCraftCoin",
            user: account.address,
            params: approveParams,
            signature: approveSignature,
            nonce: approveNonce,
          }),
        });

        const approveResult = await approveResponse.json();
        if (!approveResult.success) {
          throw new Error(approveResult.message);
        }

        // Fetch nonce for applyForGig
        const applyNonceResponse = await fetch(`${RELAYER_URL}/nonce/${account.address}`);
        const { nonce: applyNonce } = await applyNonceResponse.json();

        // Apply for the gig
        const applyParams = { databaseId };
        const applyMessage = JSON.stringify({
          functionName: "applyForGig",
          user: account.address,
          params: applyParams,
          nonce: applyNonce,
        });
        const applySignature = await signMessageAsync(applyMessage);

        toast.message("Applying for gig...");
        const applyResponse = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName: "applyForGig",
            user: account.address,
            params: applyParams,
            signature: applySignature,
            nonce: applyNonce,
          }),
        });

        const applyResult = await applyResponse.json();
        if (applyResult.success) {
          toast.success("Application submitted successfully");
          router.push("/manage-jobs/artisans");
          return true;
        } else {
          throw new Error(applyResult.message);
        }
      } catch (error: unknown) {
        console.error("Application error:", error);
        const err = error as ErrorWithReason;
        let errorMessage = "Error during application";

        if (err.reason === "Invalid gig ID") {
          errorMessage = "This gig is invalid or does not exist.";
        } else if (err.reason === "Unverified artisan") {
          errorMessage = "You must be a verified artisan to apply.";
        } else if (err.reason === "Gig is closed") {
          errorMessage = "This gig is closed.";
        } else if (err.reason === "Artisan already hired") {
          errorMessage = "An artisan has already been hired for this gig.";
        } else if (err.reason === "Already applied") {
          errorMessage = "You have already applied for this gig.";
        } else if (err.reason === "Cannot apply to your own gig") {
          errorMessage = "You cannot apply to your own gig.";
        } else if (err.reason === "Insufficient allowance") {
          errorMessage = "Insufficient CFT allowance.";
        } else if (err.message?.includes("User rejected") || err.message?.includes("rejected")) {
          errorMessage = "Transaction cancelled by user";
        } else {
          errorMessage = err.message || "Transaction failed";
        }

        toast.error(errorMessage);
        return false;
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, ensureCorrectChain, signMessageAsync, router, RELAYER_URL]
  );

  return { applyForGig, isLoading };
};

export default useApplyForGig;