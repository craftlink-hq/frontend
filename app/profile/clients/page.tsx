"use client";
import ProfileHeader from "@/components/Profile/Header";
import Footer from "@/components/LandingPage/Footer";
import Status from "@/components/Profile/Status";
import Settings from "@/components/Profile/Settings";
import ClientProfileCard from "@/components/Profile/ClientProfileCard";
import ClientTokenUsage from "@/components/Profile/ClientTokenUsage";
import { usePathname } from "next/navigation";
import { Abdul } from "@/utils/job";

export default function Profile() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div>
      <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] w-full">
        <ProfileHeader isActive={isActive} />
      </div>
      <div className="pt-24 px-4 flex flex-col gap-y-4 md:px-16 2xl:px-32">
        <div className="w-fit pt-8">
          <h1 className="font-bold text-xl">PROFILE</h1>
          <p className="border-b-2 border-yellow w-[80%]"></p>
        </div>

        <Status
          title="You're All Set!"
          desc="Now that your profile is complete, start posting projects and connecting with top artisans today."
        />

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-full">
            <ClientProfileCard client={Abdul} />
          </div>
          <div className="lg:col-span-1 h-full">
            <ClientTokenUsage available={210} spent={290}/>
          </div>
        </div>

        <Settings />
        <Footer />
      </div>
    </div>
  );
}
