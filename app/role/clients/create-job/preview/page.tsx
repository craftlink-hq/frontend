"use client";
import Footer from "@/components/LandingPage/Footer";
// import ClientCard from "@/components/PostJob/ClientCard";
import ClientStatus from "@/components/PostJob/ClientStatus";
import ProjectDetails from "@/components/PostJob/ProjectDetails";
import { useGetJobData, useGetClientData, useGetUserRole } from "@/utils/store";
import { Job } from "@/utils/types";
import { useAccount } from "@/lib/thirdweb-hooks";
import { useLoading } from "@/hooks/useLoading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "@/app/API/axios";
import handleApiError, { GigResponse } from "@/app/API/handleApiError";
import useCreateGig from "@/hooks/Gasless/useCreateGig";
import Loading from "@/components/Loading";

export default function JobPreview() {
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
    reset
  } = useGetJobData();
  const { username, location, clientBio, clientAvatar, preferredLanguage, joined } = useGetClientData();
  const { address } = useAccount();
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const { createGig, isLoading: createGigLoading } = useCreateGig();
  const { role } = useGetUserRole();

  const handlePostJobClick = async () => {
    if (role != "client") {
      toast.error("Please register as a client first.");
      return;
    }

    if (!address) {
      toast.error("Wallet not connected.");
      return;
    }

    startLoading();
    try {
      const jobData = {
        clientAddress: address,
        title: jobTitle,
        skillCategory: requiredSkills,
        preferredLocation: jobLocation || location,
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

      const stageResponse = await axios.post("/api/gigs/stage", jobData);
      const stageData = await handleApiError<GigResponse>(stageResponse);

      const formattedRoot = stageData.merkleRoot.startsWith("0x")
        ? stageData.merkleRoot
        : `0x${stageData.merkleRoot}`;
      const formattedDatabaseId = stageData.databaseId.startsWith("0x")
        ? stageData.databaseId
        : `0x${stageData.databaseId}`;
      const merkleProof = stageData.merkleProof;
      const budgetInBaseUnit = Number(amount) / 1000000;

      const createGigResult = await createGig(formattedRoot, formattedDatabaseId, budgetInBaseUnit);
      if (!createGigResult) {
        throw new Error("Blockchain transaction failed");
      }

      const confirmResponse = await axios.post("/api/gigs/confirm", {
        ...jobData,
        databaseId: formattedDatabaseId,
        merkleRoot: formattedRoot,
        merkleProof,
        status: 'CREATED',
        createdAt: new Date(),
      });
      await handleApiError(confirmResponse);

      toast.success("Gig successfully posted!");
      // Clear cached job and client data after successful post
      reset();
      router.push("/manage-jobs/clients");
    } catch (error) {
      toast.error("Error posting job");
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  const handleEditJobClick = () => {
    router.push("/role/clients/create-job/title");
  };

  // Transform job data into the Job interface
  const jobData: Job = {
    createdAt: new Date().toLocaleDateString(),
    projectDuration: { weeks: duration },
    title: jobTitle,
    preferredLocation: jobLocation || location,
    language: "English",
    totalJobs: 1,
    experienceLevel: experienceRequired,
    price: (amount / 1000000),
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
      dateJoined: joined,
      id: address ?? "1",
      // Use IPFS location if available, otherwise use job location
      location: location,
      language: preferredLanguage,
      status: "First Time Client",
      // Use IPFS username if available, otherwise use "Anonymous"
      username: username,
      avatar: clientAvatar,
      moneySpent: 0,
      completed: 0,
      posted: 0,
      noProjectSpentMoney: 0,
      rating: 0,
    },
    applicants: []
  };

  return (
    <Loading show={createGigLoading}>
      <div className="px-4 flex flex-col gap-y-4 md:gap-y-8 md:px-16 2xl:px-32">
        <div className="w-fit pt-8">
          <h1 className="font-bold text-xl text-[#FCFBF7]">JOB POST PREVIEW</h1>
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
        {/* <ClientCard client={jobData.client} /> */}
        <Footer />
      </div>
    </Loading>
  );
}