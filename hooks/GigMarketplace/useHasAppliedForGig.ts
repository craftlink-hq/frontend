"use client";

import { getGigContract } from "@/constants/contracts";
import { useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useHasAppliedForGig = () => {
  const [hasAppliedForGig, setHasAppliedForGig] = useState<boolean | null>(null);

  const checkHasApplied = useCallback(async (artisanAddress: string, databaseId: string) => {
    try {
      const contract = getGigContract(readOnlyProvider);
      const resp = await contract.hasAppliedForGig(artisanAddress, databaseId);
      setHasAppliedForGig(resp);
      return resp;
    } catch (error) {
      toast.error("Error checking application status");
      console.error("Error checking if user has applied for gig:", error);
      setHasAppliedForGig(null);
    }
  }, []);

  return { hasAppliedForGig, checkHasApplied};
};

export default useHasAppliedForGig;