"use client";

import { useEffect, useState } from "react";
import { getReviewContract } from "@/constants/contracts";
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

export const useGetArtisanReviewInfos = (artisanAddress: string) => {
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const contract = getReviewContract(readOnlyProvider);
        const reviewInfos = await contract.getArtisanReviewInfos(artisanAddress);
        setReviews(reviewInfos);
      } catch (error) {
        toast.error("Error fetching artisan reviews");
        console.error("Error fetching artisan reviews:", error);
      }
    };

    if (artisanAddress) {
      fetchReviews();
    }
  }, [artisanAddress]);

  return reviews;
};