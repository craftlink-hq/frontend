import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@/lib/thirdweb-hooks';
import { getGigContract } from '@/constants/contracts';
import { readOnlyProvider } from '@/constants/providers';
import axios from "@/app/API/axios";
import { Applied } from '@/utils/types';
import { mapToApplied } from '@/utils/mapToApplied';
import { useLoading } from '@/hooks/useLoading';

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

export const useFetchArtisanAppliedGigs = () => {
  const { address } = useAccount();
  const [appliedGigs, setAppliedGigs] = useState<Applied[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchGigs = useCallback(async () => {
    if (!address) {
      setAppliedGigs([]);
      stopLoading();
      return;
    }

    startLoading();
    setError(null);

    try {
      const contract = getGigContract(readOnlyProvider);
      const databaseIds: string[] = await contract.getArtisanAppliedGigs(address);

      const gigPromises = databaseIds.map(async (databaseId: string) => {
        const backendResponse = await axios.get(`/api/gigs/${databaseId}`);
        const backendData: BackendGigData = backendResponse.data.gig;

        const contractData = await contract.getGigInfo(databaseId);

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
          // Dispute data is optional, so we can handle it later
        };

        return mapToApplied(gigData, address, 'artisan');
      });

      const fetchedGigs = await Promise.all(gigPromises);
      setAppliedGigs(
        fetchedGigs.filter(
          (gig) =>
            gig.status === 'review' &&
            gig.job.id === gig.job.id &&
            gig.job.status === 'CREATED'
        )
      );
    } catch (err) {
      setError('Failed to fetch applied gigs');
      console.error(err);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { appliedGigs, isLoading, error };
};