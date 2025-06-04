"use client";
import ProfileHeader from "@/components/Profile/Header";
import Footer from "@/components/LandingPage/Footer";
import About from "@/components/Profile/About";
import Portfolio from "@/components/Profile/Portfolio";
// import Details from "@/components/Profile/Details";
// import Skills from "@/components/Profile/Skills";
import Review from "@/components/Profile/Review";
import Settings from "@/components/Profile/Settings";
import ProfileCard from "@/components/Profile/ProfileCard";
import TokenBalance from "@/components/Profile/TokenBalance";
import { usePathname } from "next/navigation";
// import type { ArtisanProfileProps } from "@/utils/profile"
import { dummyProfile as profile } from "@/utils/profile";
// import { useAccount } from "wagmi"
// import Loading from "@/components/Loading"
// import { useEffect, useState } from "react"
// import useGetArtisanDetails from "@/hooks/useGetArtisanDetails"
// import axios from "@/app/API/axios"
// import { transformBackendProfileData } from "@/utils/transformBackendProfileData"

export default function Profile() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  // const { address } = useAccount()
  // const detail = useGetArtisanDetails()
  // const [profile, setProfile] = useState<ArtisanProfileProps | null>(null)
  // const [isLoading, setIsLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)
  // const router = useRouter()

  // useEffect(() => {
  //   const fetchArtisanProfile = async () => {
  //     if (!address) {
  //       setIsLoading(false)
  //       return
  //     }

  //     setIsLoading(true)
  //     setError(null)

  //     try {
  //       const response = await axios.get(`/api/artisans/${address}`)
  //       const artisanData = response.data.artisan

  //       if (detail) {
  //         const transformedProfile = transformBackendProfileData(artisanData, detail, address)
  //         setProfile(transformedProfile)
  //       }
  //     } catch (err) {
  //       console.error("Error fetching artisan profile:", err)
  //       setError("Failed to load artisan profile.")
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchArtisanProfile()
  // }, [address, detail])

  // if (isLoading || !profile) {
  //   return <Loading show={false} />
  // }

  // if (error) {
  //   return <div>{error}</div>
  // }

  // const handleNext = () => {
  //   router.push("/marketplace")
  // }

  return (
    <div>
      <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] w-full">
        <ProfileHeader isActive={isActive} />
      </div>
      <div className="pt-24 px-4 flex flex-col gap-y-4 md:gap-y-8 md:px-16 2xl:px-32">
        <div className="w-fit pt-8">
          <h1 className="font-bold text-xl">PROFILE</h1>
          <p className="border-b-2 border-yellow w-[80%]"></p>
        </div>

        {/* New Profile Header Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-full">
            <ProfileCard profile={profile} />
          </div>
          <div className="lg:col-span-1">
            <TokenBalance />
          </div>
        </div>

        <About />

        <Portfolio portfolio={profile.portfolio} />
        {profile.reviews && <Review reviews={profile.reviews} />}
        <Settings />
        <Footer />
      </div>
    </div>
  );
}
