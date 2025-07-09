import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getGigContract } from '@/constants/contracts';
import { readOnlyProvider } from '@/constants/providers';
import axios from "@/app/API/axios";
import { Applied } from '@/utils/job';
import { mapToApplied } from '@/utils/mapToApplied';
import { useLoading } from '@/hooks/useLoading';
import useGetClientAmountSpent from "@/hooks/PaymentProcessor/useGetClientAmountSpent";
import { ethers } from 'ethers';

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
        const backendResponse = await axios.get(`/api/gigs/${databaseId}`);
        const backendData: BackendGigData = backendResponse.data;

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
        };

        return mapToApplied(gigData, address, 'client', clientAmountSpent);
      });

      const fetchedGigs = await Promise.all(gigPromises);
      setClosedGigs(
        fetchedGigs.filter(
          (gig) =>
            gig.status === 'closed' &&
            gig.job.id === gig.job.id &&
            gig.job.completedBy?.walletAddress === '0x0000000000000000000000000000000000000000'
        )
      );
    } catch (err) {
      setError('Failed to fetch closed gigs');
      console.error(err);
    } finally {
      stopLoading();
    }
  }, [address, clientAmountSpent]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { closedGigs, isLoading, error };
};