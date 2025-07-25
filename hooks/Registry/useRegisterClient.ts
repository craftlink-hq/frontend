"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useStoreIPFS } from "@/utils/store";
import { useChainId, useAccount } from "@/lib/thirdweb-hooks";
import { useRouter } from "next/navigation";
import { useChainSwitch } from "../useChainSwitch";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { thirdwebClient } from "@/app/client";
import { liskSepolia } from "@/constants/chain";

type ErrorWithReason = {
  reason?: string;
  message?: string;
};

const useRegisterClient = () => {
    const chainId = useChainId();
    const account = useActiveAccount();
    const { isConnected } = useAccount();
    const { ipfsUrl } = useStoreIPFS();
    const router = useRouter();
    const { ensureCorrectChain } = useChainSwitch();

    return useCallback(
        async () => {
            if (!account) {
                toast.warning("Please connect your wallet first.");
                return false;
            }

            if (!isConnected) {
                toast.warning("Please connect your wallet first.");
                return;
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
                    address: process.env.REGISTRY as string,
                });

                // Prepare the contract call
                const transaction = prepareContractCall({
                    contract,
                    method: "function registerAsClient(string memory ipfsUrl)",
                    params: [ipfsUrl],
                });

                toast.message("Please wait while we process your transaction.");

                // Send the transaction
                await sendTransaction({
                    transaction,
                    account,
                });

                toast.success("Account created");
                router.push("/role/clients/claim-token");
            } catch (error) {
                const err = error as ErrorWithReason;
                const errorMessage = err.reason === "User already registered" ? "You are already registered as an client." : "An error occurred while registering.";
                toast.error(errorMessage);
                console.error("Registration error:", error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chainId, isConnected]
    );
};

export default useRegisterClient;