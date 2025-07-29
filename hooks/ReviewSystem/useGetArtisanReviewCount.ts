"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetArtisanReviewCount = (artisanAddress: string) => {
  const [reviewCount, setReviewCount] = useState<number>(0);

  const fetchReviewCount = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const count = await contract.getArtisanReviewCount(artisanAddress);
      setReviewCount(count);
    } catch (error) {
      toast.error("Error fetching artisan review count");
      console.error("Error fetching artisan review count:", error);
    }
  }, [artisanAddress]);

  useEffect(() => {
    fetchReviewCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return reviewCount;
};

export default useGetArtisanReviewCount;