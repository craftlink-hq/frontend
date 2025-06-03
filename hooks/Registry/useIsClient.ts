"use client";

import { getRegistryContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useIsClient = () => {
    const { address } = useAccount();
    const [isClient, setIsClient] = useState<boolean | null>(null);

    useEffect(() => {
        const checkIsClient = async () => {
            try {
                const contract = getRegistryContract(readOnlyProvider);
                const resp = await contract.isClient(address);

                setIsClient(resp);
            } catch (error) {
                toast.error("Error checking user role");
                console.error("Error checking if user is client:", error);
                setIsClient(null);
            }
        }

        if (address) {
            checkIsClient();
        }
    }, [address]);

    return isClient;
}

export default useIsClient;