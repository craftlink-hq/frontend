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

const useGetReviewDetails = (reviewer: string, reviewee: string, databaseId: string) => {
  const [review, setReview] = useState<ReviewInfo | null>(null);

  const fetchReviewDetails = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const reviewInfo = await contract.getReviewDetails(reviewer, reviewee, databaseId);
      setReview(reviewInfo);
    } catch (error) {
      toast.error("Error fetching review details");
      console.error("Error fetching review details:", error);
      setReview(null);
    }
  }, [reviewer, reviewee, databaseId]);

  useEffect(() => {
    fetchReviewDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return review;
};

export default useGetReviewDetails;