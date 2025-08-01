"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";
import IPFS from "@/hooks/useIPFS";

const useGetArtisanReviews = (artisanAddress: string) => {
  const { fetchFromIPFS } = IPFS();
  const [reviews, setReviews] = useState<string[]>([]);

  const fetchReviews = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const commentHashes = await contract.getArtisanReviews(artisanAddress);

      // Fetch review text from IPFS for each commentHash
      const reviewTexts = await Promise.all(
        commentHashes.map(async (hash: string) => {
          try {
            const text = await fetchFromIPFS(hash);
            return text;
          } catch (error) {
            console.error(`Failed to fetch review from IPFS for hash ${hash}:`, error);
            return "Review text unavailable";
          }
        })
      );

      setReviews(reviewTexts);
    } catch (error) {
      toast.error("Error fetching artisan review comments");
      console.error("Error fetching artisan review comments:", error);
      setReviews([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artisanAddress]);

  useEffect(() => {
    fetchReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return reviews;
};

export default useGetArtisanReviews;