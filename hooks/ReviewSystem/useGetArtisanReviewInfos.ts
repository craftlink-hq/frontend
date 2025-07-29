"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

interface ReviewInfo {
  reviewer: string;
  reviewee: string;
  databaseId: string;
  rating: number;
  commentHash: string;
  timestamp: number;
}

const useGetArtisanReviewInfos = (artisanAddress: string) => {
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);

  const fetchReviews = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const reviewInfos = await contract.getArtisanReviewInfos(artisanAddress);
      setReviews(reviewInfos);
    } catch (error) {
      toast.error("Error fetching artisan reviews");
      console.error("Error fetching artisan reviews:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artisanAddress]);

  useEffect(() => {
    fetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return reviews;
};

export default useGetArtisanReviewInfos;