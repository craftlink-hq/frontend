"use client";

import { getPaymentProcessorContract } from "@/constants/contracts";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetPaymentDetails = (paymentId: number) => {
  const { isConnected } = useAccount();
  const [paymentDetails, setPaymentDetails] = useState<{
    client: string;
    amount: number;
    platformFee: number;
    isReleased: boolean;
  } | null>(null);

  const fetchPaymentDetails = useCallback(async () => {
    if (isNaN(paymentId)) {
      console.warn("Invalid payment ID:", paymentId);
      setPaymentDetails(null);
      return;
    }
    
    try {
      const contract = getPaymentProcessorContract(readOnlyProvider);
      const resp = await contract.getPaymentDetails(paymentId);
      setPaymentDetails(resp);
    } catch (error) {
      toast.error("Error fetching payment details");
      console.error("Error fetching payment details:", error);
      setPaymentDetails(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, paymentId, fetchPaymentDetails]);

  return paymentDetails;
};

export default useGetPaymentDetails;