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

interface DisputeData {
  disputeType: string;
  issue: string;
  disputeRaisedDate: string;
  disputeStatus: 'pending' | 'resolved' | 'escalated';
}

interface GigData {
  backend: BackendGigData;
  contract: ContractGigData;
  dispute?: DisputeData;
}

export const useFetchClientDisputedGigs = () => {
  const { address } = useAccount();
  const clientAmountSpent = useGetClientAmountSpent() ?? undefined;
  const [disputedGigs, setDisputedGigs] = useState<Applied[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);

  const fetchGigs = useCallback(async () => {
    if (!address) {
      setDisputedGigs([]);
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
        const backendData: BackendGigData = backendResponse.data.gig;

        const contractData = await contract.getGigInfo(databaseId);

        // Placeholder dispute data
        const disputeData: DisputeData | undefined = {
          disputeType: 'Work Quality',
          issue: 'Client questioned the quality of work delivered.',
          disputeRaisedDate: new Date().toISOString().split('T')[0],
          disputeStatus: 'pending',
        };

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
          dispute: (await contract.hiredArtisan()).toLowerCase() !== '0x0000000000000000000000000000000000000000' && contract.artisanComplete && !contract.isCompleted ? disputeData : undefined,
        };

        return mapToApplied(gigData, address, 'client', clientAmountSpent);
      });

      const fetchedGigs = await Promise.all(gigPromises);
      setDisputedGigs(
        fetchedGigs.filter((gig) => gig.status === 'dispute' && gig.job.id === gig.job.id)
      );
    } catch (err) {
      setError('Failed to fetch disputed gigs');
      console.error(err);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, clientAmountSpent]);

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { disputedGigs, isLoading, error };
};