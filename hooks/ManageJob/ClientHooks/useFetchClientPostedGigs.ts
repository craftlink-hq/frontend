// hooks/useFetchClientPostedGigs.ts
import { useState, useEffect, useCallback } from 'react';
import { useAccount } from '@/lib/thirdweb-hooks';
import { getGigContract, getRegistryContract } from '@/constants/contracts';
import { readOnlyProvider } from '@/constants/providers';
import axios from "@/app/API/axios";
import { Applied, Artisan } from '@/utils/types';
import { mapToApplied } from '@/utils/mapToApplied';
import { useLoading } from '@/hooks/useLoading';
import useGetClientAmountSpent from "@/hooks/PaymentProcessor/useGetClientAmountSpent";
import IPFS from "@/hooks/useIPFS";

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
  applicants: Artisan[];
}

export const useFetchClientPostedGigs = () => {
  const { address } = useAccount();
  const clientAmountSpent = useGetClientAmountSpent() ?? undefined;
  const [postedGigs, setPostedGigs] = useState<Applied[]>([]);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const { fetchFromIPFS } = IPFS();

  const fetchGigs = useCallback(async () => {
    if (!address) {
      setPostedGigs([]);
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

        const applicantAddresses: string[] = await contract.getGigApplicants(databaseId);
        const applicants = await Promise.all(
            applicantAddresses.map(async (addr: string) => {
                try {
                    const response = await axios.get(`/api/artisans/${addr}`);
                    const backendArtisan = response.data.artisan as Artisan;

                    const artisanDetails = await fetchArtisanDetailsForAddress(addr);
                    if (artisanDetails) {
                        backendArtisan.username = artisanDetails.username;
                        backendArtisan.location = artisanDetails.location;
                    }

                    return backendArtisan;
                } catch (error) {
                    console.error(`Failed to fetch artisan data for address ${addr}:`, error);
                    return null; // Error to be handled gracefully
                }
            })
        );

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
          applicants: applicants.filter((applicant): applicant is Artisan => applicant !== null),
        };

        return mapToApplied(gigData, address, 'client', clientAmountSpent);
      });

      const fetchedGigs = await Promise.all(gigPromises);
      setPostedGigs(
        fetchedGigs.filter(
          (gig) =>
            gig.status === 'posted' &&
            gig.job.id === gig.job.id &&
            gig.job.status === 'CREATED'
        )
      );
    } catch (err) {
      setError('Failed to fetch posted gigs');
      console.error(err);
    } finally {
      stopLoading();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, clientAmountSpent]);

  // Helper function to fetch artisan details from IPFS
  const fetchArtisanDetailsForAddress = async (addr: string) => {
    try {
      const contract = getRegistryContract(readOnlyProvider);
      const details = await contract.getArtisanDetails(addr);
      const ipfsHash = details[0];

      if (ipfsHash) {
        const fetchedDetail = await fetchFromIPFS(ipfsHash);
        return JSON.parse(fetchedDetail) as { username: string; location: string };
      }
      return null;
    } catch (error) {
      console.error(`Failed to fetch IPFS details for ${addr}:`, error);
      return null;
    }
  };

  useEffect(() => {
    fetchGigs();
  }, [fetchGigs]);

  return { postedGigs, isLoading, error };
};