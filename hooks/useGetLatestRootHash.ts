"use client";

import { getGigContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useGetLatestRootHash = () => {
    const [rootHash, setRootHash] = useState<string | null>(null);

    useEffect(() => {
        const fetchLatestRootHash = async () => {
            try {
                const contract = getGigContract(readOnlyProvider);
                const hash = await contract.getLatestRootHash();
                
                setRootHash(hash);
            } catch (error) {
                toast.error("Error fetching latest root hash");
                console.error("Error fetching latest root hash:", error);
                setRootHash(null);
            }
        }

        fetchLatestRootHash();
    }, []);

    return rootHash;
}

export default useGetLatestRootHash;
