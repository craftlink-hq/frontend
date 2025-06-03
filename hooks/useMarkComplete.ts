"use client";

import { useCallback } from "react";
import { getProvider } from "@/constants/providers";
import { isSupportedChain } from "@/constants/chain";
import { getGigContract } from "@/constants/contracts";
import { toast } from "sonner";
import { useChainId, useAccount } from "wagmi";
import { useAppKitProvider, type Provider } from "@reown/appkit/react";
import { useRouter } from "next/navigation";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

const useMarkComplete = () => {
    const chainId = useChainId();
    const { isConnected } = useAccount();
    const { walletProvider } = useAppKitProvider<Provider>('eip155');
    const router = useRouter();

    return useCallback(
        async (databaseId: string) => {
            if (!isConnected) {
                toast.warning("Please connect your wallet first.");
                return;
            }
            if (!isSupportedChain(chainId)) {
                toast.warning("Unsupported network. Please switch to the correct network.");
                return;
            }

            const readWriteProvider = getProvider(walletProvider);
            const signer = await readWriteProvider.getSigner();
            const contract = getGigContract(signer);

            try {
                const gasEstimate = await contract.markComplete.estimateGas(databaseId);
                const txn = await contract.markComplete(
                    databaseId,
                    { gasLimit: gasEstimate }
                );
                
                toast.message("Please wait while we process your transaction.");
                const receipt = await txn.wait();

                if (!receipt.status) {
                    throw new Error("Transaction failed");
                }

                toast.success("Gig marked as complete");
                router.push("/manage-jobs/artisans/completed");
            } catch (error) {
                const err = error as ErrorWithReason;
                let errorMessage = "An error occurred while marking the gig as complete.";
                
                if (err.reason === "Not hired artisan") {
                    errorMessage = "You are not the hired artisan for this gig.";
                } else if (err.reason === "Gig finished") {
                    errorMessage = "This gig is already completed or closed.";
                } else if (err.reason === "Already marked") {
                    errorMessage = "You have already marked this gig as complete.";
                } else if (err.reason === "Invalid gig ID") {
                    errorMessage = "The gig ID is invalid.";
                }
                
                toast.error(errorMessage);
                console.error("Mark complete error:", error);
            }
        },
        [chainId, isConnected]
    );
};

export default useMarkComplete;
