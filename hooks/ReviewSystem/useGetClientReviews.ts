"use client";

import { useEffect, useState } from "react";
import { getReviewContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

export const useGetClientReviews = (clientAddress: string) => {
  const [comments, setComments] = useState<string[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const contract = getReviewContract(readOnlyProvider);
        const commentHashes = await contract.getClientReviews(clientAddress);
        setComments(commentHashes);
      } catch (error) {
        toast.error("Error fetching client review comments");
        console.error("Error fetching client review comments:", error);
      }
    };

    if (clientAddress) {
      fetchComments();
    }
  }, [clientAddress]);

  return comments;
};