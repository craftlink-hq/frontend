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

export const useGetClientReviewInfos = (clientAddress: string) => {
  const [reviews, setReviews] = useState<ReviewInfo[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const contract = getReviewContract(readOnlyProvider);
        const reviewInfos = await contract.getClientReviewInfos(clientAddress);
        setReviews(reviewInfos);
      } catch (error) {
        toast.error("Error fetching client reviews");
        console.error("Error fetching client reviews:", error);
      }
    };

    if (clientAddress) {
      fetchReviews();
    }
  }, [clientAddress]);

  return reviews;
};