"use client";

import { getGigContract } from "@/constants/contracts";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useHasAppliedForGig = (databaseId: string) => {
  const { address, isConnected } = useAccount();
  const [hasAppliedForGig, setHasAppliedForGig] = useState<boolean | null>(null);

  const checkHasApplied = useCallback(async () => {
    try {
      const contract = getGigContract(readOnlyProvider);
      const resp = await contract.hasAppliedForGig(address, databaseId);
      setHasAppliedForGig(resp);
    } catch (error) {
      toast.error("Error checking application status");
      console.error("Error checking if user has applied for gig:", error);
      setHasAppliedForGig(null);
    }
  }, [address, databaseId]);

  useEffect(() => {
    checkHasApplied();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return hasAppliedForGig;
};

export default useHasAppliedForGig;