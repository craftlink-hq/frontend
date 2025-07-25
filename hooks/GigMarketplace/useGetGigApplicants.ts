"use client";

import { getGigContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useLoading } from "../useLoading";

const useGetGigApplicants = (databaseId: string) => {
    const { isConnected } = useAccount();
    const [gigApplicants, setGigApplicants] = useState<string[] | null>(null);
    const { isLoading, startLoading, stopLoading } = useLoading();

  const fetchGigApplicants = useCallback(async () => {
    if (!databaseId) return;

    startLoading();

    try {
      const contract = getGigContract(readOnlyProvider);
      const response = await contract.getGigApplicants(databaseId);
      setGigApplicants(response);
    } catch (error) {
      toast.error("Error fetching gig applicants");
      console.error("Error fetching gig applicants:", error);
      setGigApplicants(null);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchGigApplicants();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return { gigApplicants, isLoading };
};

export default useGetGigApplicants;