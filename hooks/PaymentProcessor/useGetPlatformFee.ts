"use client";

import { getPaymentProcessorContract } from "@/constants/contracts";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";

const useGetPlatformFee = () => {
  const [platformFee, setPlatformFee] = useState<number | null>(null);

  const checkPlatformFee = useCallback(async () => {
    try {
      const contract = getPaymentProcessorContract(readOnlyProvider);
      const resp = await contract.getPlatformFeePercentage();
      setPlatformFee(resp);
    } catch (error) {
      console.error("Error fetching platform fee:", error);
      setPlatformFee(null);
    }
  }, []);

  useEffect(() => {
    checkPlatformFee();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return platformFee;
};

export default useGetPlatformFee;