"use client";

import { getCraftCoinContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { useEffect, useState, useCallback } from "react";
import { readOnlyProvider } from "@/constants/providers";
import { toast } from "sonner";

const useGetCraftCoinBalance = () => {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState<number | null>(null);

  const checkCraftCoinBalance = useCallback(async () => {
    if (!address) return;

    try {
      const contract = getCraftCoinContract(readOnlyProvider);
      const resp = await contract.balanceOf(address);
      setBalance(resp);
    } catch (error) {
      toast.error("Error checking craftcoin balance");
      console.error("Error checking user balance:", error);
      setBalance(null);
    }
  }, [address]);

  useEffect(() => {
    checkCraftCoinBalance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return balance;
};

export default useGetCraftCoinBalance;