"use client";

import { getRegistryContract } from "@/constants/contracts";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState, useCallback } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import { useLoading } from "../useLoading";

interface Client {
  walletAddress: string;
  verificationStatus: boolean;
  about: string;
  dateJoined: string;
  location: string;
  language: string;
  status: string;
  username: string;
  avatar: string;
}

const useGetClientInfo = (address: string) => {
  const { fetchFromIPFS } = IPFS();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<Client | null>(null);

  const fetchClientDetails = useCallback(async () => {
    if (!address || address === null || address === "") return;

    startLoading();
    setError(null);

    try {
      const contract = getRegistryContract(readOnlyProvider);
      const details = await contract.getClientDetails(address);
      const ipfsHash = details[0];

      if (ipfsHash) {
        const parsedDetails = await fetchFromIPFS(ipfsHash);
        const {
          username,
          location,
          clientBio,
          clientAvatar,
          preferredLanguage,
          joined,
        } = JSON.parse(parsedDetails);

        const client = {
          walletAddress: address,
          verificationStatus: true,
          about: clientBio,
          dateJoined: joined,
          location: location,
          language: preferredLanguage,
          status: "Active",
          username: username,
          avatar: clientAvatar,
        };

        setClientData(client);
      } else {
        setError("No IPFS hash found for client");
      }
    } catch (err) {
      console.error("Error fetching client details:", err);
      setError("Failed to fetch client details");
      toast.error("Error fetching client details");
    } finally {
      stopLoading();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchFromIPFS, address]);

  useEffect(() => {
    fetchClientDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return { clientData, isLoading, error };
};

export default useGetClientInfo;
