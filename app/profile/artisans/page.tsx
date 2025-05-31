"use client";
import ProfileHeader from "@/components/Profile/Header";
import Footer from "@/components/LandingPage/Footer";
import About from "@/components/Profile/About";
import Portfolio from "@/components/Profile/Portfolio";
import Details from "@/components/Profile/Details";
import Skills from "@/components/Profile/Skills";
import Status from "@/components/Profile/Status";
import Review from "@/components/Profile/Review";
import Settings from "@/components/Profile/Settings";
import { usePathname, useRouter } from "next/navigation";
import { ArtisanProfileProps } from "@/utils/profile";
import { useAccount } from "wagmi";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import useGetArtisanDetails from "@/hooks/useGetArtisanDetails";
import axios from "@/app/API/axios";
import { transformBackendProfileData } from "@/utils/transformBackendProfileData";

export default function Profile() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { address } = useAccount();
  const detail = useGetArtisanDetails();
  const [profile, setProfile] = useState<ArtisanProfileProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArtisanProfile = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/artisans/${address}`);
        const artisanData = response.data.artisan;

        if (detail) {
          const transformedProfile = transformBackendProfileData(artisanData, detail, address);
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
  }, [address, detail]);

  if (isLoading || !profile) {
    return <Loading show={false} />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleNext = () => {
    router.push("/marketplace");
  };

  return (
    <div>
      <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] ">
        <ProfileHeader isActive={isActive} />
      </div>
      <div className="pt-24 px-4  flex flex-col gap-y-4 md:gap-y-8 md:px-16 2xl:px-32">
        <div className="w-fit  pt-8">
          <h1 className="font-bold text-xl ">PROFILE</h1>
          <p className="border-b-2 border-yellow w-[80%]"></p>
        </div>{" "}
        <Status
          onClick={handleNext}
          title={"You’re All Set!"}
          shortDesc={"Your profile is ready to go, and clients are waiting!"}
          desc={
            "Now that your profile is complete, it’s time to get noticed. Start exploring new opportunities today!"
          }
          button={"START BROWSING JOBS"}
          imageSrc={"/profile-ready.png"}
        />
        <About about={profile.about} />
        <div className="grid md:grid-cols-5 gap-4 w-full h-full">
          <div className="md:col-span-2">
            <Details details={profile.details} />
          </div>
          <div className="md:col-span-3">
            <Skills skills={profile.skills} />
          </div>
        </div>
        <Portfolio portfolio={profile.portfolio} />
        {profile.reviews && <Review reviews={profile.reviews} />}
        <Settings />
        <Footer />
      </div>
    </div>
  );
}