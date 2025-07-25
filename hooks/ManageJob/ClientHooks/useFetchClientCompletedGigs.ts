import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@/lib/thirdweb-hooks';
import { getGigContract } from '@/constants/contracts';
import { readOnlyProvider } from '@/constants/providers';
import axios from "@/app/API/axios";
import { Applied } from '@/utils/types';
import { mapToApplied } from '@/utils/mapToApplied';
import { useLoading } from '@/hooks/useLoading';
import useGetClientAmountSpent from "@/hooks/PaymentProcessor/useGetClientAmountSpent";

interface BackendGigData {
  _id: string;
  id: string;
  title: string;
  projectDuration: { weeks: number };
  preferredLocation: string;
  experienceLevel: string;
  projectDescription: string;
  price: number;
  skillCategory: string[];
  clientAddress: string;
  createdAt: string;
  status: string;
  contextLink?: string;
  additionalProjectInfo?: string;
  files?: { url: string }[];
}

interface ContractGigData {
  client: string;
  hiredArtisan: string;
  paymentId: number;
  rootHash: string;
  artisanComplete: boolean;
  isCompleted: boolean;
  isClosed: boolean;
}

interface GigData {
  backend: BackendGigData;
  contract: ContractGigData;
}

export const useFetchClientCompletedGigs = (walletAddress?: string) => {
  const { address } = useAccount();
  const clientAmountSpent = useGetClientAmountSpent() ?? 404;
  const [completedGigs, setCompletedGigs] = useState<Applied[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchGigs = useCallback(async () => {
    if (!address || !walletAddress) {
      setCompletedGigs([]);
      stopLoading();
      return;
    }

    startLoading();
    setError(null);

    try {
      const contract = getGigContract(readOnlyProvider);
      const databaseIds: string[] = await contract.getClientCreatedGigs(walletAddress ?? address);

      const gigPromises = databaseIds.map(async (databaseId: string) => {
        try {
          if (!databaseId) {
            throw new Error(`Invalid database ID: ${databaseId}`);
          }

          const backendResponse = await axios.get(`/api/gigs/${databaseId}`);
          const backendData: BackendGigData = backendResponse.data.gig;

          const contractData = await contract.getGigInfo(databaseId);

          const isCompleted =
            contractData.artisanComplete &&
            contractData.isCompleted &&
            !contractData.isClosed

          if (!isCompleted) {
            return null;
          }

          const gigData: GigData = {
            backend: backendData,
            contract: {
              client: contractData.client,
              hiredArtisan: contractData.hiredArtisan,
              paymentId: contractData.paymentId,
              rootHash: contractData.rootHash,
              artisanComplete: contractData.artisanComplete,
              isCompleted: contractData.isCompleted,
              isClosed: contractData.isClosed,
            },
          };

          return mapToApplied(gigData, address ?? walletAddress, 'client', clientAmountSpent);
        } catch (error) {
          console.error(`Error processing database ID ${databaseId}:`, error);
          return null;
        }
      });

      const fetchedGigs = (await Promise.all(gigPromises)).filter((gig): gig is Applied => gig !== null);
      setCompletedGigs(fetchedGigs);
    } catch (err) {
      setError('Failed to fetch completed gigs');
      console.error(err);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientAmountSpent]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { completedGigs, isLoading, error };
};