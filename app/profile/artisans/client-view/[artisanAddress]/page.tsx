"use client";
import AccountCard from "@/components/Profile/AccountCard";
import ProfileHeader from "@/components/Profile/Header";
import type { ArtisanProfileProps } from "@/utils/profile";
import { transformBackendProfileData } from "@/utils/transformBackendProfileData";
import { usePathname } from "next/navigation";
import PreviewPortfolio from "@/components/Profile/PreviewPortfolio";
import Works from "@/components/Profile/WorkHistory";
import PreviewReview from "@/components/Profile/PreviewReview";
import Loading from "@/components/Loading";
import useGetArtisanInfo from "@/hooks/ManageJob/useGetArtisanInfo";
import { useEffect, useState, use } from "react";
import axios from "@/app/API/axios";
import PreviewAbout from "@/components/Profile/PeviewAbout";
import { useFetchArtisanCompletedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanCompletedGigs";

export default function ClientProfileView({
  params,
}: {
  params: Promise<{ artisanAddress: string }>;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { artisanAddress } = use(params);
  const { artisanInfo } = useGetArtisanInfo(artisanAddress);
  const [profile, setProfile] = useState<ArtisanProfileProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { completedGigs } = useFetchArtisanCompletedGigs(artisanAddress);

  useEffect(() => {
    const fetchArtisanProfile = async () => {
      if (!artisanAddress) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/artisans/${artisanAddress}`);
        const artisanData = response.data.artisan;

        if (artisanInfo) {
          const transformedProfile = transformBackendProfileData(
            artisanData,
            artisanInfo,
            artisanAddress
          );
          setProfile(transformedProfile);
        }
      } catch (err) {
        console.error("Error fetching artisan profile:", err);
        setError("Failed to load artisan profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtisanProfile();
  }, [artisanAddress, artisanInfo]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-red-500">
          {error ? `Error: ${error}` : "Artisan not found."}
        </span>
      </div>
    );
  }

  if (isLoading || !profile) {
    return <Loading show={false} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] ">
        <ProfileHeader isActive={isActive} />
      </div>
      <div className="py-8 pt-32 px-4  flex flex-col gap-y-4 md:gap-y-8 md:px-8 xl:px-16 2xl:px-32">
        <AccountCard artisan={profile} />
        <PreviewAbout profile={profile} />{" "}
        <PreviewPortfolio portfolio={profile.portfolio} />
        <div className="grid gap-4">
          <Works works={completedGigs} />

          <PreviewReview reviews={profile.reviews} />
        </div>
      </div>
    </div>
  );
}
