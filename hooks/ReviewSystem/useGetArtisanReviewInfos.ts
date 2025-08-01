"use client";

import { useEffect, useState, useCallback } from "react";
import { getReviewContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";
import IPFS from "@/hooks/useIPFS";
import { ReviewsProp } from "@/utils/profile";

interface ReviewInfo {
  reviewer: string;
  reviewee: string;
  databaseId: string;
  rating: number;
  commentHash: string;
  timestamp: number;
}

const useGetArtisanReviewInfos = (artisanAddress: string) => {
  const [reviews, setReviews] = useState<ReviewsProp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchFromIPFS } = IPFS();

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const contract = getReviewContract(readOnlyProvider);
      const reviewInfos: ReviewInfo[] = await contract.getArtisanReviewInfos(artisanAddress);

      const enrichedReviews = await Promise.all(
        reviewInfos.map(async (review, index) => {
          let commentText: string;
          try {
            commentText = await fetchFromIPFS(review.commentHash);
            // Check if the content is HTML
            if (commentText.startsWith("<!DOCTYPE html>")) {
              console.warn(`Invalid review content for hash ${review.commentHash}`);
              commentText = "Review text unavailable (invalid content)";
            }
          } catch (ipfsError) {
            console.warn(`Failed to fetch comment from IPFS for hash ${review.commentHash}:`, ipfsError);
            commentText = "Review text unavailable";
          }

          return {
            id: `${review.databaseId}-${index}`,
            reviewer: review.reviewer,
            review: commentText,
            rating: Number(review.rating),
          };
        })
      );

      setReviews(enrichedReviews);
    } catch (error) {
      toast.error("Error fetching artisan reviews");
      console.error("Error fetching artisan reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [artisanAddress, fetchFromIPFS]);

  useEffect(() => {
    if (artisanAddress) {
      fetchReviews();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artisanAddress]);

  return { reviews, isLoading };
};

export default useGetArtisanReviewInfos;