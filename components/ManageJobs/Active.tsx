"use client";
import { useState, useEffect } from "react";
import { Applied } from "@/utils/types";
import Image from "next/image";
import AnimatedDiv from "@/components/AnimatedDiv";
import { formatDate } from "@/utils/formatDate";
import RaiseDisputeModal from "./RaiseDisputeModal";
import { useGetUserRole } from "@/utils/store";
import { readOnlyProvider } from "@/constants/providers";
import { getGigContract } from "@/constants/contracts";
import { useMarkComplete } from "@/hooks/Gasless/useMarkComplete";
import { useConfirmComplete } from "@/hooks/Gasless/useConfirmComplete";
import { useRouter } from "next/navigation";
import Loading from "../Loading";
import { toast } from "sonner";

const ActiveJob = ({ job }: { job: Applied }) => {
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const { role } = useGetUserRole();
  const contract = getGigContract(readOnlyProvider);
  const { markComplete, isLoading: mcLoading } = useMarkComplete();
  const { confirmComplete, isLoading: ccLoading } = useConfirmComplete();
  const [isCompleted, setIsCompleted] = useState(job.status === "completed");
  const router = useRouter();

  const handleMarkComplete = async () => {
    if (!job.job?.id) return;
    const databaseId = job.job?.id;
    const contractData = await contract.getGigInfo(databaseId);

    if (role === "artisan" && !contractData.artisanComplete) {
      const success = await markComplete(String(databaseId));
      if (success) {
        setDisableButton(true);
        router.push("/manage-jobs/artisans/completed");
      }
    } else if (
      role === "client" &&
      !contractData.isCompleted &&
      !contractData.isClosed
    ) {
      if (!contractData.artisanComplete) {
        toast.error("The artisan has not marked this job as complete yet.");
        return;
      }

      const success = await confirmComplete(String(databaseId));
      if (success) {
        setDisableButton(true);
        setIsCompleted(true);
        router.push("/manage-jobs/clients/completed");
      }
    }
  };

  const handleOpenDisputeModal = () => {
    setIsDisputeModalOpen(true);
  };

  const handleCloseDisputeModal = () => {
    setIsDisputeModalOpen(false);
  };

  const handleViewProfile = () => {
    let address
    if (role === "artisan") {
      address =  job?.job?.client?.walletAddress
      router.push(`/profile/clients/artisan-view/${address}`);
    } else if (role === "client") {
      address = job.job.completedBy?.walletAddress;
      router.push(`/profile/artisans/client-view/${address}`);
    }
  };

  useEffect(() => {
    if (isDisputeModalOpen) {
      document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    } else {
      document.body.style.backgroundColor = "";
    }

    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [isDisputeModalOpen]);

  return (
    <Loading show={mcLoading || ccLoading}>
      <AnimatedDiv
        initialX="100%"
        animateX={0}
        exitX={"-100%"}
        duration={1.0}
        className="hover:bg-[#F2E8CF0A] bg-[#F2E8CF0A] border border-[#FCFBF726] w-[92%] md:w-full rounded-xl flex flex-col p-4 md:p-6 gap-y-3 md:gap-y-4 overflow-hidden"
      >
        {/* Posted Date - Top Left */}
        <div className="flex justify-start">
          <div className="bg-[#00F7FF17] px-2 md:px-3 py-1 rounded">
            <span className="text-[#4AC7CB] text-xs md:text-sm">
              Posted: {formatDate(job.job?.createdAt)}
            </span>
          </div>
        </div>

        {/* User Info Row - Wallet Address Left, Profile Right */}
        <div className="flex justify-between items-center">
          {job.user_type === "artisan" ? (
            <span className="text-[#F9F1E2] text-base md:text-lg font-alata">
              {job.job?.client?.walletAddress.slice(0, 4)}...
              {job.job?.client?.walletAddress.slice(-4)}
            </span>
          ) : (
            <span className="text-[#F9F1E2] text-base md:text-lg font-alata">
              {job.job?.completedBy?.walletAddress.slice(0, 4)}...
              {job.job?.completedBy?.walletAddress.slice(-4)}
            </span>
          )}
          <div className="flex items-center gap-x-2 md:gap-x-3">
            <button
              className="text-[#FFD700] text-xs md:text-sm cursor-pointer hover:underline"
              onClick={() => handleViewProfile()}
            >
              View Profile
            </button>
            <div className="rounded-full bg-[#FFD700] h-8 w-8 md:h-10 md:w-10 flex justify-center items-center cursor-pointer">
              <span className="relative h-4 w-4 md:h-6 md:w-6">
                <Image
                  src="/messages.png"
                  alt="Profile"
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Job Title - Large and Prominent */}
        <div className="w-full">
          <h3 className="font-merriweather text-lg md:text-2xl lg:text-3xl text-white leading-tight">
            {job.job?.title}
          </h3>
        </div>

        {/* Job Details Row - Single Line on Mobile */}
        <div className="flex items-center text-[10px] md:text-sm text-[#B5B4AD] gap-0.5 md:gap-x-6">
          <div className="flex items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-0 border-r border-[#FCFBF726]">
            <span className="relative h-3 w-3 md:h-4 md:w-4">
              <Image
                src="/location.svg"
                alt="Location"
                fill
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="whitespace-nowrap">{job.job?.preferredLocation || "Lagos, Nigeria"}</span>
          </div>
          <div className="flex items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-0 border-r border-[#FCFBF726]">
            <span className="relative h-3 w-3 md:h-4 md:w-4">
              <Image
                src="/language.svg"
                alt="Language"
                fill
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="whitespace-nowrap">{job.job?.language || "English"}</span>
          </div>
          <div className="flex items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-0 border-r border-[#FCFBF726]">
            <span className="relative h-3 w-3 md:h-4 md:w-4">
              <Image
                src="/market/calendar-tick.svg"
                alt="Duration"
                fill
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="whitespace-nowrap">
              {job.job?.projectDuration?.weeks
                ? `${job.job.projectDuration.weeks}w`
                : "2w"}
            </span>
          </div>
          <div className="flex items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-0">
            <span className="relative h-3 w-3 md:h-4 md:w-4">
              <Image
                src="/market/medal-star.svg"
                alt="Skill"
                fill
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="whitespace-nowrap">{job.job?.experienceLevel || "Intermediate"}</span>
          </div>
        </div>

        {/* Price Section - Left Aligned with Icon */}
        <div className="flex items-start gap-x-2 md:gap-x-3">
          <span className="relative h-6 w-6 md:h-8 md:w-8 mt-1 flex-shrink-0">
            <Image
              src="/market/money-2.svg"
              alt="Price"
              fill
              style={{ objectFit: "contain" }}
            />
          </span>
          <div className="flex flex-col">
            <span className="text-[#FFD700] text-xl md:text-2xl font-bold">
              ${job.job?.price || "1,500"}
              <span className="text-xs md:text-sm font-normal ml-1">(Fixed)</span>
            </span>
            <span className="text-[#B5B4AD] text-xs md:text-sm">
              ≈ ₦
              {job.job?.price
                ? (job.job.price * 1500).toLocaleString()
                : "2,250,000"}
            </span>
          </div>
        </div>

        {/* Dates Row - Single Line on Mobile */}
        <div className="flex items-center text-xs md:text-sm text-[#B5B4AD] gap-2 md:gap-x-8">
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <span className="relative h-3 w-3 md:h-4 md:w-4">
              <Image
                src="/calendar.svg"
                alt="Start Date"
                fill
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="whitespace-nowrap">Start: {job?.startDate || "13/12/24"}</span>
          </div>
          <div className="flex items-center gap-x-1 md:gap-x-2">
            <span className="relative h-3 w-3 md:h-4 md:w-4">
              <Image
                src="/endDate.png"
                alt="End Date"
                fill
                style={{ objectFit: "contain" }}
              />
            </span>
            <span className="whitespace-nowrap">End: {job?.endDate || "27/12/24"}</span>
          </div>
        </div>

        {/* Status - Yellow Dot with Message */}
        <div className="flex items-center gap-x-2">
          <div className="bg-[#FFD700] h-3 w-3 rounded-full flex-shrink-0"></div>
          <span className="text-[#B5B4AD] text-xs md:text-sm italic">
            {job?.statusMsg || "Pending: Awaiting your acceptance."}
          </span>
        </div>

        {/* Action Buttons - Full Width Side by Side */}
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:gap-[10px] mt-4">
          <button
            disabled={disableButton || isCompleted}
            onClick={handleMarkComplete}
            className={`w-full md:w-[232px] h-[43px] rounded-[4px] uppercase text-xs md:text-sm font-bold px-6 py-3 border transition-colors
    ${
      isCompleted
        ? "bg-[#F2E8CF0A] text-[#FCF8E3] border-[#262208] cursor-not-allowed"
        : "bg-[#FFD700] text-[#1A1203] border-transparent hover:bg-[#E6C200]"
    }
  `}
          >
            {isCompleted ? "COMPLETED" : "MARK AS COMPLETE"}
          </button>
          <button
            onClick={handleOpenDisputeModal}
            disabled={job.status === "dispute"}
            className={`w-full md:w-[232px] h-[43px] rounded-[4px] uppercase text-xs md:text-sm font-bold px-6 py-3 border transition-colors
    ${
      job.status === "dispute"
        ? "bg-[#F2E8CF0A] text-[#262208] border-[#FFD700] cursor-not-allowed"
        : "bg-[#262208] text-[#FCF8E3] border-transparent hover:bg-[#333316]"
    }
  `}
          >
            {job.status === "dispute" ? "DISPUTED" : "RAISE DISPUTE"}
          </button>
        </div>

        {/* Raise Dispute Modal */}
        <RaiseDisputeModal
          isOpen={isDisputeModalOpen}
          onClose={handleCloseDisputeModal}
        />
      </AnimatedDiv>
    </Loading>
  );
};

export default ActiveJob;