"use client";
import ProfileHeader from "@/components/Profile/Header";
import Footer from "@/components/LandingPage/Footer";
import { usePathname } from "next/navigation";
import { jobs } from "@/utils/job";
import CompletedProjects from "@/components/Profile/ViewCompletedProject";
import AccountCard from "@/components/Profile/ClientAccCard";
import { use } from "react";
import Loading from "@/components/Loading";
import useGetClientInfo from "@/hooks/ManageJob/useGetClientInfo";

export default function ArtisanView({
 params,
}: {
  params: Promise<{ clientAddress: string }>;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { clientAddress } = use(params);
  const { clientData, isLoading, error } = useGetClientInfo(clientAddress);
  
 if (isLoading || !clientData) {
    return <Loading show={false} />
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-lg text-red-500">
          {error ? `Error: ${error}` : "clientData not found."}
        </span>
      </div>
    );
  }


  return (
      <div>
        <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] ">
          <ProfileHeader isActive={isActive} />
        </div>
        <div className="pt-24 px-4  flex flex-col gap-y-4 md:gap-y-8 md:px-16 2xl:px-32">
          <AccountCard client={clientData} />
          <CompletedProjects projects={jobs} />
          <Footer />
        </div>
      </div>
  );
}
