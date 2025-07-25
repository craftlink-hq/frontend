"use client";

import { useAccount } from "@/lib/thirdweb-hooks";
import { useEffect, useState, useCallback } from "react";
import IPFS from "@/hooks/useIPFS";
import { useLoading } from "../useLoading";
import { ArtisanProfileProps } from "@/utils/profile";
import axios from "@/app/API/axios";
import useGetArtisanDetails from "../Registry/useGetArtisanDetails";
import { transformBackendProfileData } from "@/utils/transformBackendProfileData";
import { AxiosError } from "axios";

const useFetchArtisanProfile = (walletAddress?: string) => { // DO NOT USE UNTIL BUG IS FIXED
  const { fetchFromIPFS } = IPFS();
  const { address, isConnected } = useAccount();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ArtisanProfileProps | null>(null);

  const detail = useGetArtisanDetails();


  const fetchArtisanProfile = useCallback(async () => {
    if (!walletAddress || !address) return;

    startLoading();

    try {
        const response = await axios.get(`/api/artisans/${walletAddress ?? address}`)
        const artisanData = response.data.artisan

        if (detail) {
          const transformedProfile = transformBackendProfileData(artisanData, detail, walletAddress ?? address);
          setProfile(transformedProfile);
        }
      } catch (err) {
        if ((err as AxiosError).response?.status === 404) {
            setProfile(null);
        } else {
            console.error("Error fetching artisan profile:", err); // THIS RETURNS BUG THAT NEEDS TO BE FIXED
            setError("Failed to load artisan profile.");
        }
      } finally {
        stopLoading();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress ?? address, fetchFromIPFS]);

  useEffect(() => {
    fetchArtisanProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  return { profile, isLoading, error };
};

export default useFetchArtisanProfile;