"use client";

import { useEffect, useState } from "react";
import { getReviewContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

export const useGetArtisanReviews = (artisanAddress: string) => {
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const contract = getReviewContract(readOnlyProvider);
        const commentHashes = await contract.getArtisanReviews(artisanAddress);
        setComments(commentHashes);
      } catch (error) {
        toast.error("Error fetching artisan review comments");
        console.error("Error fetching artisan review comments:", error);
      }
    };

    if (artisanAddress) {
      fetchComments();
    }
  }, [artisanAddress]);

  return comments;
};