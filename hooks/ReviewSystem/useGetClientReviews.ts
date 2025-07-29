"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetClientReviews = (clientAddress: string) => {
  const [comments, setComments] = useState<string[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const commentHashes = await contract.getClientReviews(clientAddress);
      setComments(commentHashes);
    } catch (error) {
      toast.error("Error fetching client review comments");
      console.error("Error fetching client review comments:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientAddress]);

  useEffect(() => {
    fetchComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return comments;
};

export default useGetClientReviews;