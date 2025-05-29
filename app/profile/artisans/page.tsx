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
import { useGetArtisanData } from "@/utils/store";
import { transformProfileData } from "@/utils/transformProfileData";
import { ArtisanProfileProps } from "@/utils/profile";
import { useAccount } from "wagmi";
import Loading from "@/components/Loading";
import { useLoading } from "@/hooks/useLoading";
import { useEffect, useState } from "react";
import useGetUserDetails from "@/hooks/useGetUserDetails";

export default function Profile() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const detail = useGetUserDetails();

  const [profile, setProfile] = useState<ArtisanProfileProps | null>(null);
  const {
    category,
    skills,
    experienceLevel,
    preferredLanguage,
    yearsOfExperience,
    tagline,
    bio,
    rate,
    availability,
    avatar,
    whProjectTitle,
    whDescription,
    whDuration,
    whMediaUrls,
  } = useGetArtisanData();
  const router = useRouter();

  const { address } = useAccount();
  const { isLoading } = useLoading();

  const handleNext = () => {
    router.push("/marketplace");
  };

  // Transform and set profile data when all required data is available
  useEffect(() => {
    if (address && detail) {
      const fetchedData = {
        category,
        skills,
        experienceLevel,
        preferredLanguage,
        yearsOfExperience,
        tagline,
        bio,
        rate,
        availability,
        avatar,
        whProjectTitle: [whProjectTitle],
        whDescription: [whDescription],
        whDuration: [whDuration],
        whMediaUrls,
      };

      const transformedProfile = transformProfileData(
        fetchedData,
        detail,
        address
      );
      setProfile(transformedProfile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, address]);

  if (isLoading || !profile) {
    return <Loading show={false} />;
  }

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
