"use client";
import Image from "next/image";
import Button from "./Button";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAccount } from "wagmi";
import useIsClient from "@/hooks/Registry/useIsClient";

interface WelcomeProps {
  image: string;
  role: string;
}

const ClientsSignIn = ({ image, role }: WelcomeProps) => {
  const { isLoading: pageLoading, startLoading, stopLoading } = useLoading();
  const { address, isConnected } = useAccount();
  const { isClient, isLoading: clientCheckLoading } = useIsClient();
  const router = useRouter();

  const handleSignIn = () => {
    if (!isConnected && !address) {
      toast.error("Please connect your wallet to continue.");
      return;
    }

    startLoading();
    
    if (isClient) {
        stopLoading();
        router.push("/profile/clients");
    } else {
        stopLoading();
        router.push("/role/clients/claim-token");
    }
  };

  return (
    <Loading show={pageLoading || clientCheckLoading}>
      <div className="flex md:items-center justify-center w-full h-[90vh] gap-y-8 gap-x-4 py-4 md:py-1">
        <div className="hidden md:flex relative h-[90%] md:w-[45%] lg:w-[38vw]">
          <Image
            src={image}
            alt={role}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="rounded-lg  border border-[#FCFBF726] md:border-0 shadow-lg h-[60%] md:h-[90%] bg-[#F2E8CF0A] flex flex-col items-center justify-center w-[90%] md:w-[45vw] gap-y-2">
          <p className="font-alata text-3xl max-sm:px-2 md:text-[2vw] text-center text-[#F9F1E2] leading-8">
            Welcome! Great to Have You Here
          </p>
          
          <span className="text-center text-[#D8D6CF]  font-merriweather">
            Sign in, find trusted artisans, and get your projects done by skilled hands
          </span>
          <Button onClick={handleSignIn} text="Sign in as Client" />
          <p className="text-center text-[#F9F1E2] gap-2  ">
            Not a client?{" "}
            <Link href="/role/artisans/signin" className="text-yellow font-bold">
              Sign in as Artisan
            </Link>
          </p>
        </div>
      </div>
    </Loading>
  );
};

export default ClientsSignIn;