"use client"

import Image from "next/image"
import Button from "./Button"
import { toast } from "sonner"
import Loading from "./Loading"
import { useRouter } from "next/navigation"
import useIsArtisan from "@/hooks/Registry/useIsArtisan"
import Link from "next/link"
import { useGetUserRole } from "@/utils/store"
import axios from "@/app/API/axios"
import { useAccount } from "@/lib/thirdweb-hooks"
import mainAxios from "axios"

interface WelcomeProps {
  image: string
  role: string
}

const ArtisansSignIn = ({ image, role }: WelcomeProps) => {
  const { address } = useAccount();
  const { isArtisan, isLoading: artisanCheckLoading } = useIsArtisan()
  const router = useRouter()
  const { setRole } = useGetUserRole()

  const handleSignIn = async () => {
    if (!address) {
      toast.error("Please connect your wallet to continue.");
      return;
    }

    setRole(role)

    if (isArtisan) {
      try {
        const response = await axios.get(`/api/artisans/${address}`);
        if (response.status === 200) {
          toast.success("Welcome back, artisan!");
          router.push("/profile/artisans");
        }
      } catch (error) {
        if (mainAxios.isAxiosError(error) && error.response?.status === 404) {
          toast.info("Please complete your artisan profile.");
          router.push("/role/artisans/onboarding/category");
        } else {
          toast.error("An error occurred while fetching your profile.");
          console.error("Profile fetch error:", error);
        }
      }
    } else {
      router.push("/authenticate/register/artisan");
    }
  }

  return (
    <Loading show={artisanCheckLoading}>
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col gap-y-2 w-full min-h-screen">  

        {/* Mobile Hero Image */}
        <div className="relative h-[45vh] w-[92%] mx-4 rounded-lg overflow-hidden">
          <Image
            src={"/welcome-artisan-mobile.svg"}
            alt={role}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>

        {/* Mobile Content */}
        <div className="flex-1 flex flex-col justify-between mx-4 p-6  bg-[#F2E8CF0A] rounded-lg">
          <div className="flex flex-col items-center text-center space-y-6 mt-8">
            <h1 className="font-alata text-3xl text-[#F9F1E2] leading-tight">Welcome! Great to Have You Here.</h1>

            <p className="text-[#D8D6CF] font-merriweather text-base leading-relaxed">
              Sign in, showcase your skills and start earning from clients who need your craft.
            </p>

            <div className="w-full space-y-4">
              <Button onClick={handleSignIn} text={"SIGN IN AS ARTISAN"} style={"font-bold w-full"} />

              <div className="flex justify-center text-[#F9F1E2] gap-2">
                Not an Artisan?{" "}
                <Link href="/role/clients/signin" className="text-yellow font-bold">
                  Sign In as Client
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Terms */}
          <div className="text-center text-sm mt-8 space-y-1">
            <p className="text-[#D8D6CF]">By Continuing, you agree to CraftLink&apos;s Privacy Policy</p>
            <p className="text-[#AEFF00] font-bold">Terms and Conditions</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:items-center justify-center w-full h-[90vh] gap-y-8 gap-x-4 py-4 md:py-1">
        <div className="hidden md:flex relative h-[90%] md:w-[45%] lg:w-[40w] xl:w-[38vw]">
          <Image
            src={image || "/placeholder.svg"}
            alt={role}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg shadow-lg"
          />
        </div>

        <div className="rounded-lg border border-[#FCFBF726] md:border-0 shadow-lg h-[80%] relative top-4 md:top-0 md:h-[90%] bg-[#F2E8CF0A] flex flex-col items-center justify-between w-[90%] md:w-[45vw] gap-y-4 p-4">
          <div></div>

          <div className="flex flex-col justify-end items-center gap-y-4 py-8">
            <p className="font-alata text-3xl px-2 lg:text-[2.5vw] text-center text-[#F9F1E2] leading-8">
              Welcome! Great to Have You Here
            </p>
            <span className="text-center text-[#D8D6CF] px-4 lg:px-2 font-merriweather">
              Sign in, showcase your skills, and start earning from clients who need your craft.
            </span>
            <Button onClick={handleSignIn} text={"Sign in as Artisan"} style={"font-normal"} />
            <div className="flex text-center text-[#F9F1E2] gap-2 relative bottom-[12px]">
              Not an artisan?{" "}
              <Link href="/role/clients/signin" className="text-yellow font-bold">
                Sign In as Client
              </Link>
            </div>
          </div>

          <div className="flex flex-col justify-center text-center text-sm">
            <span className="text-[#D8D6CF]">By Continuing, you agree to CraftLink&apos;s Privacy Policy</span>
            <span className="text-[#AEFF00] font-bold text-center">Terms and Conditions</span>
          </div>
        </div>
      </div>
    </Loading>
  )
}

export default ArtisansSignIn
