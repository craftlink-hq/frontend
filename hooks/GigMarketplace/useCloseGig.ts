"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useChainId, useAccount } from "@/lib/thirdweb-hooks";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { thirdwebClient } from "@/app/client";
import { liskSepolia } from "@/constants/chain";
import { useChainSwitch } from "../useChainSwitch";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

const useCloseGig = () => {
    const chainId = useChainId();
    const account = useActiveAccount();
    const { isConnected } = useAccount();
    const router = useRouter();
    const { ensureCorrectChain } = useChainSwitch();

    return useCallback(
        async (databaseId: string) => {
            if (!account) {
                toast.warning("Please connect your wallet first.");
                return false;
            }

            const isCorrectChain = await ensureCorrectChain();
            if (!isCorrectChain) {
                return false;
            }

            try {
                // Get the contract instance using thirdweb
                const contract = getContract({
                    client: thirdwebClient,
                    chain: liskSepolia,
                    address: process.env.GIG_MARKET_PLACE as string,
                });

                // Prepare the contract call
                const transaction = prepareContractCall({
                    contract,
                    method: "function closeGig(string memory databaseId)",
                    params: [databaseId],
                });

                toast.message("Please wait while we process your transaction.");

                // Send the transaction
                await sendTransaction({
                    transaction,
                    account,
                });

                toast.success("Gig closed successfully and the funds have been refunded.");
                router.push("/manage-jobs/clients/closed");
        
                return true;
            } catch (error) {
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
                }
                
                toast.error(errorMessage);
                console.error("Close gig error:", error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chainId, isConnected]
    );
};

export default useCloseGig;
