"use client";

import { getRegistryContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import useIsArtisan from "./useIsArtisan";

const useGetArtisanDetails = () => {
    const isArtisan = useIsArtisan();
    const { fetchFromIPFS } = IPFS();
    const { address } = useAccount();
    const [artisanDetails, setArtisanDetails] = useState<{
        username: string;
        location: string;
    } | null>(null);

    useEffect(() => {
        const fetchArtisanDetails = async () => {
            if (isArtisan === null) return;

            try {
                if (!isArtisan) {
                    toast.error("Please create an artisan account");
                    return;
                }

                const contract = getRegistryContract(readOnlyProvider);
                const details = await contract.getArtisanDetails(address);
                
                if (details?.ipfsHash) {
                    try {
                        const fetchedDetail = await fetchFromIPFS(details.ipfsHash);
                        setArtisanDetails(JSON.parse(fetchedDetail));
                    } catch (error) {
                        toast.error("Error fetching from IPFS");
                        console.error("Error fetching from IPFS:", error);
                        setArtisanDetails(null);
                    }
                }
            } catch (error) {
                toast.error("Error fetching artisan details");
                console.error("Error fetching artisan details:", error);
            }
        }

        if (address) {
            fetchArtisanDetails();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isArtisan]);

    return artisanDetails;
}

export default useGetArtisanDetails;