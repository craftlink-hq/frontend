"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { useSignMessage } from "@/lib/thirdweb-hooks";
import { useChainSwitch } from "../useChainSwitch";
import { useLoading } from "../useLoading";

const useCreateGig = () => {
  const account = useActiveAccount();
  const { signMessageAsync } = useSignMessage();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const RELAYER_URL = process.env.RELAYER_URL;
  const { ensureCorrectChain } = useChainSwitch();

  const createGig = useCallback(
    async (rootHash: string, databaseId: string, budget: number) => {
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

      if (!rootHash || !databaseId || !budget) {
        toast.error("Invalid gig parameters");
        return false;
      }

      startLoading();

      try {
        const provider = new ethers.JsonRpcProvider(
          "https://base-sepolia.g.alchemy.com/v2/7YcyjUTTMHZ7Ff_gdbynvaCPgRB6kL0Q"
        );
        const tokenContract = new ethers.Contract(process.env.TOKEN!, ['function balanceOf(address) view returns (uint256)'], provider);
        const budgetInWei = ethers.parseUnits(budget.toString(), 6);
        const tokenBalance = await tokenContract.balanceOf(account.address);

        if (tokenBalance < budgetInWei) {
          toast.error("Insufficient USDT balance to create this gig.");
          return false;
        }

        if (!RELAYER_URL) {
          throw new Error("Relayer URL is not defined");
        }

        // Fetch nonce for approval
        const approveNonceResponse = await fetch(`${RELAYER_URL}/nonce/${account.address}`);
        const { nonce: approveNonce } = await approveNonceResponse.json();

        // Gasless approval
        const approveParams = {
          spender: process.env.PAYMENT_PROCESSOR as string,
          amount: budgetInWei.toString(),
        };
        const approveMessage = JSON.stringify({ functionName: "approveToken", user: account.address, params: approveParams, nonce: approveNonce });
        const approveSignature = await signMessageAsync(approveMessage);

        toast.message("Approving token spending...");
        const approveResponse = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName: "approveToken",
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

        // Fetch nonce for gig creation
        const createNonceResponse = await fetch(`${RELAYER_URL}/nonce/${account.address}`);
        const { nonce: createNonce } = await createNonceResponse.json();

        // Create the gig
        const createParams = {
          rootHash,
          databaseId,
          budget: budgetInWei.toString(),
        };
        const createMessage = JSON.stringify({ functionName: "createGig", user: account.address, params: createParams, nonce: createNonce });
        const createSignature = await signMessageAsync(createMessage);

        toast.message("Creating gig...");
        const createResponse = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName: "createGig",
            user: account.address,
            params: createParams,
            signature: createSignature,
            nonce: createNonce,
          }),
        });

        const createResult = await createResponse.json();
        if (createResult.success) {
          toast.success("Gig created successfully");
          router.push("/manage-jobs/clients");
          return true;
        } else {
          throw new Error(createResult.message);
        }
      } catch (error: unknown) {
        console.error("Gig creation error:", error);
        if ((error as Error).message.includes("User rejected") || (error as Error).message.includes("rejected")) {
          toast.info("Transaction cancelled by user");
        } else {
          toast.error("Error during gig creation: " + ((error as Error).message || "Unknown error"));
        }
        return false;
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, ensureCorrectChain, signMessageAsync, router, RELAYER_URL]
  );

  return { createGig, isLoading };
};

export default useCreateGig;