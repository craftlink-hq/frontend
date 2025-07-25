"use client";

import { getRegistryContract } from "@/constants/contracts"
import { readOnlyProvider } from "@/constants/providers";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useLoading } from "../useLoading";

const useCheckDualRole = (address: string) => {
  const { isConnected } = useAccount();
  const [hasDualRole, setHasDualRole] = useState<boolean | null>(null);
  const { isLoading, startLoading, stopLoading } = useLoading();

  const checkDualRole = useCallback(async () => {
    if (!address) return;

    startLoading();
    try {
      const contract = getRegistryContract(readOnlyProvider);
      const checkArtisan = await contract.isArtisan(address);
      const checkClient = await contract.isClient(address);

      const dualRole = checkArtisan && checkClient;
      setHasDualRole(dualRole);
    } catch (error) {
      const typedError = error as { code?: string; message?: string };
      if (typedError.code === "BAD_DATA" || typedError.message?.includes("could not decode result data")) {
        setHasDualRole(false);
      } else {
        toast.error("Error checking dual role");
        console.error("Error checking if user has dual role:", error);
        setHasDualRole(null);
      }
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    checkDualRole();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return { hasDualRole, isLoading };
};

export default useCheckDualRole;