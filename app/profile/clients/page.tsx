"use client";
import ProfileHeader from "@/components/Profile/Header";
import Footer from "@/components/LandingPage/Footer";
import Settings from "@/components/Profile/Settings";
import ClientProfileCard from "@/components/Profile/ClientProfileCard";
import ClientTokenUsage from "@/components/Profile/ClientTokenUsage";
import { usePathname } from "next/navigation";
import useGetClientDetails from "@/hooks/Registry/useGetClientDetails";
import useGetTokenBalance from "@/hooks/Token/useGetTokenBalance";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useAccount } from "@/lib/thirdweb-hooks";
import useGetClientAmountSpent from "@/hooks/PaymentProcessor/useGetClientAmountSpent";
import { useFetchClientCompletedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientCompletedGigs";

export default function Profile() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { address } = useAccount();
  const { clientData, isLoading: clientLoading, error: clientError } = useGetClientDetails(address as string);
  const tokenBalance = useGetTokenBalance();
  const [error, setError] = useState<string | null>(null);
  const spent = useGetClientAmountSpent(address as string);
  const { completedGigs: Completed, isLoading: completedLoading } = useFetchClientCompletedGigs(address);
  const completedGigsCount = Completed.length;

  useEffect(() => {
    if (clientError) {
      setError(clientError);
    }
  }, [clientError]);

  if (clientLoading || completedLoading) {
    return <Loading show={true} />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error || "Failed to load profile data due to reload"}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="fixed z-50 backdrop-blur-3xl bg-opacity-100 h-[75px] w-full">
        <ProfileHeader isActive={isActive} />
      </div>
      <div className="pt-24 px-4 flex flex-col gap-y-4 md:px-16 2xl:px-32">
        <div className="w-fit pt-8">
          <h1 className="font-bold text-xl text-[#FCFBF7]">PROFILE</h1>
          <p className="border-b-2 border-yellow w-[80%]"></p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="md:hidden h-full">
            <ClientTokenUsage available={tokenBalance ?? 404} spent={spent as number} />
          </div>
          <div className="lg:col-span-2 h-full">
            {clientData && <ClientProfileCard client={clientData} completedGigsCount={completedGigsCount} />}
          </div>
          <div className="hidden md:flex lg:col-span-1 h-full">
            <ClientTokenUsage available={tokenBalance ?? 404} spent={spent as number} />
          </div>
        </div>

        <Settings />
        <Footer />
      </div>
    </div>
  );
}