"use client";

import { getPaymentProcessorContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
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
    if (!paymentId) return;
    try {
      const contract = getPaymentProcessorContract(readOnlyProvider);
      console.log(paymentId);
      const resp = await contract.getPaymentDetails(paymentId);
      console.log("Hooks payment details", resp);
      setPaymentDetails(resp);
    } catch (error) {
      toast.error("Error fetching payment details");
      console.error("Error fetching payment details:", error);
      setPaymentDetails(null);
    }
  }, []);

  useEffect(() => {
    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return paymentDetails;
};

export default useGetPaymentDetails;
