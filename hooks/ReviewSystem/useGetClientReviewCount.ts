"use client";

import { getReviewContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetClientReviewCount = (clientAddress: string) => {
  const [reviewCount, setReviewCount] = useState<number>(0);

  const fetchReviewCount = useCallback(async () => {
    try {
      const contract = getReviewContract(readOnlyProvider);
      const count = await contract.getClientReviewCount(clientAddress);
      setReviewCount(count);
    } catch (error) {
      toast.error("Error fetching client review count");
      console.error("Error fetching client review count:", error);
      setReviewCount(0);
    }
  }, [clientAddress]);

  useEffect(() => {
    fetchReviewCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return reviewCount;
};

export default useGetClientReviewCount;