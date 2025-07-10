"use client";

import { getRegistryContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState, useCallback } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import { useLoading } from "../useLoading";

const useGetArtisanInfo = (address: string) => {
  const { fetchFromIPFS } = IPFS();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [artisanInfo, setArtisanInfo] = useState<{
    username: string;
    location: string;
  } | null>(null);

  const fetchArtisanDetails = useCallback(async () => {
    if (!address || address === null || address === "") return;

    startLoading();
    setError(null);

    try {
      const contract = getRegistryContract(readOnlyProvider);
      const details = await contract.getArtisanDetails(address);
      const ipfsHash = details[0];

      if (ipfsHash) {
        const fetchedDetail = await fetchFromIPFS(ipfsHash);
        setArtisanInfo(JSON.parse(fetchedDetail));
      } else {
        setError("No IPFS hash found for artisan");
      }
    } catch (error) {
      toast.error("Error fetching artisan details");
      setError("Error fetching artisan details");
      console.error("Error:", error);
      setArtisanInfo(null);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, fetchFromIPFS]);

  useEffect(() => {
    fetchArtisanDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { artisanInfo, isLoading, error };
};

export default useGetArtisanInfo;