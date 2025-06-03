"use client";

import { getRegistryContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useIsArtisan = () => {
    const { address } = useAccount();
    const [isArtisan, setIsArtisan] = useState<boolean | null>(null);

    useEffect(() => {
        const checkIsArtisan = async () => {
            try {
                const contract = getRegistryContract(readOnlyProvider);
                const resp = await contract.isArtisan(address);

                setIsArtisan(resp);
            } catch (error) {
                toast.error("Error checking user role");
                console.error("Error checking if user is artisan:", error);
                setIsArtisan(null);
            }
        }

        if (address) {
            checkIsArtisan();
        }
    }, [address]);

    return isArtisan;
}

export default useIsArtisan;