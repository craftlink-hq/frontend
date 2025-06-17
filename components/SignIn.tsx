"use client";
import Image from "next/image";
import Button from "./Button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLoading } from "@/hooks/useLoading";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import useIsArtisan from "@/hooks/Registry/useIsArtisan";
import useIsClient from "@/hooks/Registry/useIsClient";
import useGetArtisanDetails from "@/hooks/Registry/useGetArtisanDetails";
import useGetClientDetails from "@/hooks/Registry/useGetClientDetails";

interface WelcomeProps {
  image: string;
  role: string;
}

const SignIn = ({ image, role }: WelcomeProps) => {
  const { isLoading } = useLoading(); // startLoading, stopLoading 
  const [userRole, setUserRole] = useState("");
  const isArtisan = useIsArtisan();
  const isClient = useIsClient();
  const artisanDetails = useGetArtisanDetails();
  const clientDetails = useGetClientDetails();
  const router = useRouter();

  console.log("isArtisan:", isArtisan);
  console.log("isClient:", isClient);
  useEffect(() => {
    if (isClient) {
      setUserRole("client");
    } else if (isArtisan) {
      setUserRole("artisan");
    }
  }, [isClient, isArtisan]);

  const welcomeMsg =
    role === "client"
      ? "Sign in, find trusted artisans, and get your projects done by skilled hands."
      : "Sign in, showcase your skills and start earning from clients who need your craft.";

  const buttonMsg = role === "client" ? "Sign in as Client" : "Sign in as an Artisan";

  const redirect = () => {
    if (userRole === "client") {
      router.push("/useRole/clients/onboarding");
    } else if (userRole === "artisan") {
      router.push("/role/artisans/onboarding/category");
    } else {
      toast.error("User role not set");
    }
  };

  const detail = role === "client" ? clientDetails : role === "artisan" ? artisanDetails : null;

  return (
    <Loading show={isLoading}>
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
        <div className="rounded-lg  border border-[#FCFBF726] md:border-0 shadow-lg h-[60%] md:h-[90%] bg-[#F2E8CF0A] flex flex-col items-center justify-center w-[90%] md:w-[45vw]">
          <p className="font-alata text-3xl max-sm:px-2  md:text-[3vw] text-center text-[#F9F1E2] leading-8 md:leading-[3vw]">
            Welcome!, Great to Have You Here,
          </p>
          <p className="uppercase font-alata  text-3xl md:text-[3vw] text-center text-[#F9F1E2] leading-8 md:leading-[3vw]">
            {detail?.username ?? role}!
          </p>
          <span className="text-center text-[#D8D6CF] lg:w-[70%] text-balance md:p-8 p-4 font-merriweather">
            {welcomeMsg}
          </span>
          <Button onClick={redirect} text={buttonMsg} />
        </div>
      </div>
    </Loading>
  );
};

export default SignIn;
