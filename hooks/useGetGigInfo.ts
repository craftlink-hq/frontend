"use client";

import { getGigContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useGetGigInfo = (databaseId: string) => {
    const { address } = useAccount();
    const [gigInfo, setGigInfo] = useState<{
        client: string;
        hiredArtisan: string;
        paymentId: number;
        rootHash: string;
        artisanComplete: boolean;
        isCompleted: boolean;
        isClosed: boolean;
    } | null>(null);

    useEffect(() => {
        const fetchGigInfo = async () => {
            try {
                const contract = getGigContract(readOnlyProvider);
                const gigData = await contract.getGigInfo(databaseId);
                
                setGigInfo({
                    client: gigData[0],
                    hiredArtisan: gigData[1],
                    paymentId: Number(gigData[2]),
                    rootHash: gigData[3],
                    artisanComplete: gigData[4],
                    isCompleted: gigData[5],
                    isClosed: gigData[6]
                });
            } catch (error) {
                toast.error("Error fetching gig information");
                console.error("Error fetching gig info:", error);
                setGigInfo(null);
            }
        }

        if (address && databaseId) {
            fetchGigInfo();
        }
    }, [address, databaseId]);

    return gigInfo;
}

export default useGetGigInfo;
