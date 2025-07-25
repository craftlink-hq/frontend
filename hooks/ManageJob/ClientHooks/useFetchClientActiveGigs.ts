import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@/lib/thirdweb-hooks';
import { getGigContract } from '@/constants/contracts';
import { readOnlyProvider } from '@/constants/providers';
import axios from '@/app/API/axios';
import { Applied } from '@/utils/types';
import { mapToApplied } from '@/utils/mapToApplied';
import { useLoading } from '@/hooks/useLoading';
import useGetClientAmountSpent from '@/hooks/PaymentProcessor/useGetClientAmountSpent';

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
  hireTimestamp?: string;
}

export const useFetchClientActiveGigs = () => {
  const { address } = useAccount();
  const clientAmountSpent = useGetClientAmountSpent() ?? undefined;
  const [activeGigs, setActiveGigs] = useState<Applied[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchGigs = useCallback(async () => {
    if (!address) {
      setActiveGigs([]);
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

          // Validate backend data
          if (!backendData?.id) {
            console.warn(`Invalid gig data for ID ${databaseId}, skipping`);
            return null;
          }

          const contractData = await contract.getGigInfo(databaseId);

          const isActive =
            contractData.hiredArtisan !== '0x0000000000000000000000000000000000000000' &&
            !contractData.isClosed &&
            !contractData.isCompleted

          if (!isActive) {
            return null;
          }

          // Fetch ArtisanHired event to get hire timestamp
          let hireTimestamp: string | undefined;
          try {
            const gigId = await contract.indexes(databaseId);
            const filter = contract.filters.ArtisanHired(gigId);
            const events = await contract.queryFilter(filter, 0, 'latest');

            if (events.length > 0) {
              const latestEvent = events[events.length - 1]; // Get the most recent hire event
              const block = await readOnlyProvider.getBlock(latestEvent.blockNumber);
              hireTimestamp = block ? new Date(block.timestamp * 1000).toISOString() : undefined;
            } else {
              console.warn(`No ArtisanHired event found for gigId ${gigId}`);
            }
          } catch (eventErr) {
            console.warn(`Failed to fetch ArtisanHired event for ${databaseId}:`, eventErr);
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
            hireTimestamp,
          };

          return mapToApplied(gigData, address, 'client', clientAmountSpent);
        } catch (err) {
          console.warn(`Failed to fetch gig with ID ${databaseId}:`, err);
          return null;
        }
      });

      const fetchedGigs = (await Promise.all(gigPromises)).filter((gig): gig is Applied => gig !== null);
      setActiveGigs(fetchedGigs);
    } catch (err) {
      setError('Failed to fetch active gigs');
      console.error('Error fetching active gigs:', err);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, clientAmountSpent]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { activeGigs, isLoading, error };
};