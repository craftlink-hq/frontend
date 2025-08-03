"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";
import { useAccount } from "@/lib/thirdweb-hooks";

const useGetClientAverageRating = (clientAddress?: string) => {
  const { address } = useAccount();
  const [clientRating, setClientRating] = useState<number | null>(null);

  const fetchClientRating = useCallback(async () => {
    try {
      if (!clientAddress || !address) {
        return;
      }

      const contract = getReviewContract(readOnlyProvider);
      const rating = await contract.getClientAverageRating(clientAddress || address);
      setClientRating(rating);
    } catch (error) {
      toast.error("Error checking client average rating");
      console.error("Error checking client rating:", error);
      setClientRating(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(clientAddress || address)]);

  useEffect(() => {
    fetchClientRating();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return clientRating;
};

export default useGetClientAverageRating;