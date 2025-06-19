"use client";

import { getRegistryContract } from "@/constants/contracts";
import { useAccount } from "wagmi";
import { readOnlyProvider } from "@/constants/providers";
import { useEffect, useState, useCallback } from "react";
import IPFS from "@/hooks/useIPFS";
import { toast } from "sonner";
import useIsClient from "./useIsClient";
import { useLoading } from "../useLoading";
import { Client } from "@/utils/job";
import useGetClientAmountSpent from "@/hooks/PaymentProcessor/useGetClientAmountSpent";
import useGetClientGigCount from "../GigMarketplace/useGetClientGigCount";
import useGetClientAverageRating from "../ReviewSystem/useGetClientAverageRating";

const useGetClientDetails = () => {
  const isClient = useIsClient();
  const { fetchFromIPFS } = IPFS();
  const { address, isConnected } = useAccount();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [clientData, setClientData] = useState<Client | null>(null);
  const moneySpent = useGetClientAmountSpent();
  const gigCount = useGetClientGigCount();
  const clientRating = useGetClientAverageRating();

  const fetchClientDetails = useCallback(async () => {
    if (!address || isClient === null) return;

    startLoading();
    setError(null);

    try {
      if (!isClient) {
        toast.error("Please create a client account");
        return;
      }

      const contract = getRegistryContract(readOnlyProvider);
      const details = await contract.getClientDetails(address);
      const ipfsHash = details[0];

      if (ipfsHash) {
        const parsedDetails = await fetchFromIPFS(ipfsHash); // const {username, location, clientBio, clientAvatar, preferredLanguage, joined}
        const { username, location, clientBio, clientAvatar, preferredLanguage, joined } = JSON.parse(parsedDetails);
        
        const client: Client = {
            walletAddress: address,
            verificationStatus: true,
            about: clientBio,
            dateJoined: joined,
            location: location,
            language: preferredLanguage,
            status: "Active",
            username: username,
            avatar: clientAvatar,
            id: address,
            moneySpent: moneySpent ?? 404,
            completed: 404,
            posted: Number(gigCount) ?? 404,
            noProjectSpentMoney: 404,
            rating: Number(clientRating) ?? 404,
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
  }, [address, isClient, fetchFromIPFS]);

  useEffect(() => {
    fetchClientDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, moneySpent, gigCount, clientRating]);

  return { clientData, isLoading, error };
};

export default useGetClientDetails;