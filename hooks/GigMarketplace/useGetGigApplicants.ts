"use client";

import { getGigContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useGetGigApplicants = (databaseId: string) => {
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

        if (databaseId) {
            fetchGigApplicants();
        }
    }, [databaseId]);

    return applicants;
}

export default useGetGigApplicants;
