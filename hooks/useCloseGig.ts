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

const useCloseGig = () => {
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
                const gasEstimate = await contract.closeGig.estimateGas(databaseId);
                const txn = await contract.closeGig(
                    databaseId,
                    { gasLimit: gasEstimate }
                );
                
                toast.message("Please wait while we process your transaction.");
                const receipt = await txn.wait();

                if (!receipt.status) {
                    throw new Error("Transaction failed");
                }

                toast.success("Job closed successfully and funds refunded");
                router.push("/manage-jobs/clients");
            } catch (error) {
                const err = error as ErrorWithReason;
                let errorMessage = "An error occurred while closing the job.";
                
                if (err.reason === "Not gig owner") {
                    errorMessage = "You don't own this job.";
                } else if (err.reason === "Cannot close active gig") {
                    errorMessage = "You cannot close a job that has an artisan hired.";
                } else if (err.reason === "Gig already Completed || Closed") {
                    errorMessage = "This job is already completed or closed.";
                } else if (err.reason === "Invalid gig ID") {
                    errorMessage = "The job ID is invalid.";
                }
                
                toast.error(errorMessage);
                console.error("Close gig error:", error);
            }
        },
        [chainId, isConnected]
    );
};

export default useCloseGig;
