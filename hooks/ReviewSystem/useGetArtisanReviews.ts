"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetArtisanReviews = (artisanAddress: string) => {
  const [comments, setComments] = useState<string[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const commentHashes = await contract.getArtisanReviews(artisanAddress);
      setComments(commentHashes);
    } catch (error) {
      toast.error("Error fetching artisan review comments");
      console.error("Error fetching artisan review comments:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artisanAddress]);

  useEffect(() => {
    fetchComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return comments;
};

export default useGetArtisanReviews;