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

export const useFetchClientClosedGigs = () => {
  const { address } = useAccount();
  const clientAmountSpent = useGetClientAmountSpent() ?? undefined;
  const [closedGigs, setClosedGigs] = useState<Applied[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchGigs = useCallback(async () => {
    if (!address) {
      setClosedGigs([]);
      stopLoading();
      return;
    }

    startLoading();
    setError(null);

    try {
      const contract = getGigContract(readOnlyProvider);
      const databaseIds: string[] = await contract.getClientCreatedGigs(address);

      const gigPromises = databaseIds.map(async (databaseId: string) => {
        try {
          const backendResponse = await axios.get(`/api/gigs/${databaseId}`);
          const backendData: BackendGigData = backendResponse.data.gig;

          const contractData = await contract.getGigInfo(databaseId);

          const isClosed =
            contractData.isClosed &&
            !contractData.isCompleted

          if (!isClosed) {
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

          return mapToApplied(gigData, address, 'client', clientAmountSpent);
        } catch (error) {
          console.error(`Error fetching gig info for ${databaseId}:`, error);
          return null;
        }
      });

      const fetchedGigs = (await Promise.all(gigPromises)).filter((gig): gig is Applied => gig !== null);
      setClosedGigs(fetchedGigs);
    } catch (err) {
      setError('Failed to fetch closed gigs');
      console.error(err);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, clientAmountSpent]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { closedGigs, isLoading, error };
};