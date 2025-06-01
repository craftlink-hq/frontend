"use client";
import Footer from "@/components/LandingPage/Footer";
import ClientCard from "@/components/PostJob/ClientCard";
import ClientStatus from "@/components/PostJob/ClientStatus";
import ProjectDetails from "@/components/PostJob/ProjectDetails";
import { useGetJobData, useGetClientData } from "@/utils/store";
import { Job } from "@/utils/job";
import { useAccount } from "wagmi";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "@/app/API/axios";
import handleApiError, { GigResponse } from "@/app/API/handleApiError";
import { wssProvider } from "@/constants/providers";
import useGetClientDetails from "@/hooks/useGetClientDetails";
import useApproveTransaction from "@/hooks/useApproveTransaction";
import useCreateGig from "@/hooks/useCreateGig";

export default function ProfilePreview() {
  const {
    jobTitle,
    jobDescription,
    jobLocation,
    amount,
    duration,
    experienceRequired,
    jobMediaUrls,
    jobContextLink,
    additionalInfo,
    requiredSkills,
  } = useGetJobData();
  const { clientBio, clientAvatar } = useGetClientData();
  const { address } = useAccount();
  const clientDetail = useGetClientDetails();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const createGig = useCreateGig();

  const handlePostJobClick = async () => {
    startLoading();
    try {
      const jobData = {
        clientAddress: address,
        clientDescription: clientBio,
        title: jobTitle,
        skillCategory: requiredSkills,
        preferredLocation: jobLocation,
        experienceLevel: experienceRequired,
        projectDescription: jobDescription,
        contextLink: jobContextLink,
        files: jobMediaUrls.map((url) => ({
          type: "IMAGE",
          url: url,
        })),
        additionalProjectInfo: additionalInfo,
        projectDuration: { weeks: duration },
        price: amount,
      };

      const backendResponse = await axios.post("/api/gigs", jobData);
      const data = await handleApiError<GigResponse>(backendResponse);

      const formattedRoot = data.merkleRoot.startsWith("0x")
        ? data.merkleRoot
        : `0x${data.merkleRoot}`;

      const formattedDatabaseId = data.databaseId.startsWith("0x")
        ? data.databaseId
        : `0x${data.databaseId}`;

      createGig(formattedRoot, formattedDatabaseId, amount);
    } catch (error) {
      toast.error("Error posting job");
      console.error(error);
    }

    stopLoading();
  };

  const handleEditJobClick = () => {
    router.push("/role/clients/create-job/title");
  };

  // Transform job data into the Job interface
  const jobData: Job = {
    createdAt: "Now",
    projectDuration: { weeks: duration },
    title: jobTitle,
    preferredLocation: jobLocation,
    language: "English",
    totalJobs: 1,
    experienceLevel: experienceRequired,
    price: amount / 1000000,
    rating: 0,
    projectDescription: jobDescription,
    type: "Open Application",
    payment: "Secured Payment",
    paymentType: "Fixed",
    skillCategory: requiredSkills,
    additionalProjectInfo: additionalInfo,
    artisans: "1",
    files: jobMediaUrls,
    images: jobMediaUrls, // Assuming images and files are the same for simplicity
    client: {
      walletAddress: address ?? "",
      verificationStatus: false,
      about: clientBio,
      dateJoined: new Date().toLocaleDateString(),
      id: "1",
      // Use IPFS location if available, otherwise use job location
      location: clientDetail?.location ?? jobLocation,
      language: "English",
      status: "First Time Client",
      // Use IPFS username if available, otherwise use "Anonymous"
      username: clientDetail?.username ?? "Anonymous",
      avatar: clientAvatar,
      moneySpent: 0,
      completed: 0,
      posted: 0,
      noProjectSpentMoney: 0,
      rating: 0,
    },
  };

  if (isLoading || !clientDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 flex flex-col gap-y-4 md:gap-y-8 md:px-16 2xl:px-32">
      <div className="w-fit pt-8">
        <h1 className="font-bold text-xl">JOB POST PREVIEW</h1>
        <p className="border-b-2 border-yellow w-[60%]"></p>
      </div>
      <div className="hidden md:grid w-full">
        <ClientStatus
          title={"Here's What Artisans Will See!"}
          desc={
            "You're one step away from finding the perfect artisan! Double-check your details before posting."
          }
          button={"POST JOB NOW"}
          onClick={handlePostJobClick}
          imageSrc={"/client-preview.png"}
          clientButton={"EDIT JOB POST"}
          clientOnClick={handleEditJobClick}
        />
      </div>
      <div className="md:hidden w-full">
        <ClientStatus
          title={"Here's What Artisans Will See!"}
          desc={
            "You're one step away from finding the perfect artisan! Double-check your details before posting."
          }
          button={"POST"}
          onClick={handlePostJobClick}
          imageSrc={"/client-preview.png"}
          clientButton={"EDIT JOB"}
          clientOnClick={handleEditJobClick}
        />
      </div>
      <ProjectDetails project={jobData} />
      <ClientCard client={jobData.client} />
      <Footer />
    </div>
  );
}
