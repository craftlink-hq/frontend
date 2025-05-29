"use client";

import { getRegistryContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import useIsClient from "./useIsClient";
import useIsArtisan from "./useIsArtisan";

const useGetUserDetails = () => {
    const isClient = useIsClient();
    const isArtisan = useIsArtisan();
    const { fetchFromIPFS } = IPFS();
    const { address } = useAccount();
    const [userDetails, setUserDetails] = useState<{
        username: string;
        location: string;
    } | null>(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (isClient === null) return;

            try {
                if (!isClient && !isArtisan) {
                    toast.error("You have to be a client or artisan to view details");
                    return;
                }

                const contract = getRegistryContract(readOnlyProvider);
                const details = isClient ? await contract.getClientDetails(address) : await contract.getArtisanDetails(address);
                
                if (details?.ipfsHash) {
                    try {
                        const fetchedDetail = await fetchFromIPFS(details.ipfsHash);
                        setUserDetails(JSON.parse(fetchedDetail));
                    } catch (error) {
                        toast.error("Error fetching from IPFS");
                        console.error("Error fetching from IPFS:", error);
                        setUserDetails(null);
                    }
                }
            } catch (error) {
                toast.error("Error fetching user details");
                console.error("Error fetching user details:", error);
            }
        }

        if (address) {
            fetchUserDetails();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isClient, isArtisan]);

    return userDetails;
}

export default useGetUserDetails;