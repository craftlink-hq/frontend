"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetClientAverageRating = (clientAddress: string) => {
  const [clientRating, setClientRating] = useState<number | null>(null);

  const fetchClientRating = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const rating = await contract.getClientAverageRating(clientAddress);
      setClientRating(rating);
    } catch (error) {
      toast.error("Error checking client average rating");
      console.error("Error checking client rating:", error);
      setClientRating(null);
    }
  }, [clientAddress]);

  useEffect(() => {
    fetchClientRating();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return clientRating;
};

export default useGetClientAverageRating;