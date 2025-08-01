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
    if (!reviewer || !reviewee || !databaseId) {
      return;
    }

    try {
      const contract = getReviewContract(readOnlyProvider);
      const reviewInfo = await contract.getReviewDetails(reviewer, reviewee, databaseId);
      setReview(reviewInfo);
    } catch (error: unknown) {
      const isReviewNotFound = 
        (error as { reason?: string; message?: string; revert?: { args?: string[] }; code?: string })?.reason === "Review not found" ||
        (error as { reason?: string }).reason === "Review not found" ||
        (error as { message?: string }).message?.includes("Review not found") ||
        (error as { revert?: { args?: string[] } })?.revert?.args?.[0] === "Review not found";
        // (error.code === "CALL_EXCEPTION" && error.reason === "Review not found");

      if (isReviewNotFound) {
        console.log("No review found for this combination - this is normal");
        setReview(null);
      } else {
        console.error("Unexpected error fetching review details:", error);
        toast.error("Error fetching review details");
        setReview(null);
      }
    }
  }, [reviewer, reviewee, databaseId]);

  useEffect(() => {
    fetchReviewDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return review;
};

export default useGetReviewDetails;