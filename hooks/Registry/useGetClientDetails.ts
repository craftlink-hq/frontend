"use client";

import { getRegistryContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import useIsClient from "./useIsClient";

const useGetClientDetails = () => {
    const isClient = useIsClient();
    const { fetchFromIPFS } = IPFS();
    const { address } = useAccount();
    const [clientDetails, setClientDetails] = useState<{
        username: string;
        location: string;
    } | null>(null);

    useEffect(() => {
        const fetchClientDetails = async () => {
            if (isClient === null) return;

            try {
                if (!isClient) {
                    toast.error("Please create a client account");
                    return;
                }

                const contract = getRegistryContract(readOnlyProvider);
                const details = await contract.getClientDetails(address);
                
                if (details?.ipfsHash) {
                    try {
                        const fetchedDetail = await fetchFromIPFS(details.ipfsHash);
                        setClientDetails(JSON.parse(fetchedDetail));
                    } catch (error) {
                        toast.error("Error fetching from IPFS");
                        console.error("Error fetching from IPFS:", error);
                        setClientDetails(null);
                    }
                }
            } catch (error) {
                toast.error("Error fetching artisan details");
                console.error("Error fetching artisan details:", error);
            }
        }

        if (address) {
            fetchClientDetails();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [address, isClient]);

    return clientDetails;
}

export default useGetClientDetails;