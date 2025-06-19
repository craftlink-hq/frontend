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
import { parse } from "path";

interface ClientDetails {
  username: string;
  location: string;
  clientBio: string;
  clientAvatar: string;
  preferredLanguage: string;
  joined: string;
}

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

  console.log("Money Spent:", moneySpent);

  const fetchClientDetails = useCallback(async () => {
    if (!address || isClient === null) return;

    console.log("Fetching client details for address:", address);

    startLoading();
    setError(null);

    try {
      if (!isClient) {
        toast.error("Please create a client account");
        return;
      }

      console.log("Fetching client details from contract...");

      const contract = getRegistryContract(readOnlyProvider);
      const details = await contract.getClientDetails(address);
      const ipfsHash = details[0];

      console.log("IPFS hash retrieved:", ipfsHash);

      if (ipfsHash) {
        const parsedDetails: ClientDetails = await fetchFromIPFS(ipfsHash);

        console.log("Parsed client details:", parsedDetails);
        
        const client: Client = {
            walletAddress: address,
            verificationStatus: true,
            about: parsedDetails.clientBio,
            dateJoined: parsedDetails.joined,
            location: parsedDetails.location,
            language: parsedDetails.preferredLanguage,
            status: "Active",
            username: parsedDetails.username,
            avatar: parsedDetails.clientAvatar,
            id: address,
            moneySpent: moneySpent ?? 404,
            completed: 404,
            posted: gigCount ?? 404,
            noProjectSpentMoney: 404,
            rating: clientRating ?? 404,
          };

          console.log("Client data fetched:", client);
          setClientData(client);
          console.log("Client data set successfully", client);
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
  }, [address, isClient, fetchFromIPFS]);

  useEffect(() => {
    fetchClientDetails();
  }, []);

  return { clientData, isLoading, error };
};

export default useGetClientDetails;