"use client";

import { getRegistryContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState, useCallback } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import useIsClient from "./useIsClient";

const useGetClientDetails = () => {
  const isClient = useIsClient();
  const { fetchFromIPFS } = IPFS();
  const { address } = useAccount();
  const [clientDetails, setClientDetails] = useState<{
    username: string;
    location: string;
  } | null>(null);

  const fetchClientDetails = useCallback(async () => {
    if (!address || isClient === null || clientDetails) return;

    try {
      if (!isClient) {
        toast.error("Please create a client account");
        return;
      }

      const contract = getRegistryContract(readOnlyProvider);
      const details = await contract.getClientDetails(address);
      const ipfsHash = details[0];

      if (ipfsHash) {
        const fetchedDetail = await fetchFromIPFS(ipfsHash);
        setClientDetails(JSON.parse(fetchedDetail));
      }
    } catch (error) {
      toast.error("Error fetching client details");
      console.error("Error:", error);
      setClientDetails(null);
    }
  }, [address, isClient, fetchFromIPFS]);

  useEffect(() => {
    fetchClientDetails();
  }, []);

  return clientDetails;
};

export default useGetClientDetails;