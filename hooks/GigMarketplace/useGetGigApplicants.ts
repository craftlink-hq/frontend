"use client";

import { getGigContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const useGetGigApplicants = (databaseId: string) => {
  const [applicants, setApplicants] = useState<string[] | null>(null);

  const fetchGigApplicants = useCallback(async () => {
    if (!databaseId || applicants) return;

    try {
      const contract = getGigContract(readOnlyProvider);
      const applicantsData = await contract.getGigApplicants(databaseId);
      setApplicants(applicantsData);
    } catch (error) {
      toast.error("Error fetching gig applicants");
      console.error("Error fetching gig applicants:", error);
      setApplicants(null);
    }
  }, [databaseId, applicants]);

  useEffect(() => {
    fetchGigApplicants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return applicants;
};

export default useGetGigApplicants;