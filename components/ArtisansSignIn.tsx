"use client";
import Image from "next/image";
import Button from "./Button";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import useIsArtisan from "@/hooks/Registry/useIsArtisan";
import Link from "next/link";
import { useAccount } from "wagmi";

interface WelcomeProps {
  image: string;
  role: string;
}

const ArtisansSignIn = ({ image, role }: WelcomeProps) => {
  const { isLoading: pageLoading } = useLoading();
  const { address, isConnected } = useAccount();
  const { isArtisan, isLoading: artisanCheckLoading } = useIsArtisan();
  const router = useRouter();

  const handleSignIn = () => {
    if (!isConnected && !address) {
      toast.error("Please connect your wallet to continue.");
      return;
    }

    if (isArtisan) {
      router.push("/profile/artisans");
    } else {
      router.push("/authenticate/register/artisan");
    }
  };

  return (
    <Loading show={pageLoading || artisanCheckLoading}>
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
            Sign in, showcase your skills, and start earning from clients who
            need your craft.
          </span>
          <Button
            onClick={handleSignIn}
            text="Sign in as Artisan"
            style={"font-normal"}
          />
          <p className="text-center text-[#F9F1E2] gap-2  ">
            Not an artisan?{" "}
            <Link href="/role/clients/signin" className="text-yellow font-bold">
              Sign in as Client
            </Link>
          </p>
        </div>
      </div>
    </Loading>
  );
};

export default ArtisansSignIn;
