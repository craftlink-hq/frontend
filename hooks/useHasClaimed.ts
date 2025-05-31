"use client";

import { getTokenContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useHasClaimed = () => {
    const { address } = useAccount();
    const [hasClaimed, setHasClaimed] = useState<boolean | null>(null);

    useEffect(() => {
        const checkHasClaimed = async () => {
            try {
                const contract = getTokenContract(readOnlyProvider);
                const resp = await contract.hasClaimed(address);

                setHasClaimed(resp);
            } catch (error) {
                toast.error("Error checking claim status");
                console.error("Error checking if user has claimed:", error);
                setHasClaimed(null);
            }
        }

        if (address) {
            checkHasClaimed();
        }
    }, [address]);

    return hasClaimed;
}

export default useHasClaimed;