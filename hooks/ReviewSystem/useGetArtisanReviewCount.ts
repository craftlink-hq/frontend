"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetArtisanReviewCount = (artisanAddress: string) => {
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchReviewCount = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const count = await contract.getArtisanReviewCount(artisanAddress);
      setReviewCount(count);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "Review not found") {
        setError("No review found for the specified gig and reviewer.");
        toast.info("No review available for this gig.");
      } else {
        setError("Error fetching review details.");
        toast.error("Error fetching review details.");
        console.error("Error fetching review details:", error);
      }
    }
  }, [artisanAddress]);

  useEffect(() => {
    fetchReviewCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { reviewCount, error };
};

export default useGetArtisanReviewCount;