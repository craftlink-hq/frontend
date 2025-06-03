"use client";

import { getGigContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useGetGigApplicants = (databaseId: string) => {
    const { address } = useAccount();
    const [applicants, setApplicants] = useState<string[] | null>(null);

    useEffect(() => {
        const fetchGigApplicants = async () => {
            try {
                const contract = getGigContract(readOnlyProvider);
                const applicantsData = await contract.getGigApplicants(databaseId);
                
                setApplicants(applicantsData);
            } catch (error) {
                toast.error("Error fetching gig applicants");
                console.error("Error fetching gig applicants:", error);
                setApplicants(null);
            }
        }

        if (address && databaseId) {
            fetchGigApplicants();
        }
    }, [address, databaseId]);

    return applicants;
}

export default useGetGigApplicants;
