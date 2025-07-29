"use client";

import type { Applied } from "@/utils/types";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useState } from "react";
import Modal from "../Modal";
import Image from "next/image";
import GigDetails from "./GigDetails";
import useGetClientInfo from "@/hooks/ManageJob/useGetClientInfo";
import { formatRelativeTime } from "@/utils/timeUtils";
import { useGetUserRole } from "@/utils/store";
import { useRouter } from "next/navigation";

const ClosedJob = ({ job }: { job: Applied }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clientData } = useGetClientInfo(job.job.client?.walletAddress || "");
  const { role } = useGetUserRole();
  const router = useRouter();

  const handleViewProfile = () => {
    // Navigate to specific applicant profile
    let address;
    if (role === "artisan") {
      address = job?.job?.client?.walletAddress
      router.push(`/profile/clients/artisan-view/${address}`);
    } else if (role === "client") {
      address = job.job.completedBy?.walletAddress;
      router.push(`/profile/artisans/client-view/${address}`);
    }
  };

  return (
    <AnimatedDiv
      initialX="100%"
      animateX={0}
      exitX={"-100%"}
      duration={1.0}
      className="group hover:bg-[#F2E8CF0A] border border-[#FCFBF726] w-[92%] md:w-full rounded-xl flex flex-col gap-y-2 font-merriweather overflow-hidden"
    >
      {/* Posted Date */}
      <div className="w-full bg-[#403F3E] p-3 md:p-4">
        <span className="text-xs md:text-sm bg-[#00F7FF17] text-[#47F9FF] italic rounded-md p-2 md:p-[10px]">
          Posted: {formatRelativeTime(job.job?.createdAt)}
        </span>
      </div>

      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {/* Client Address */}
        {job.user_type === "artisan" ? (
          <div className="mb-2 flex justify-between items-center">
            <p className="text-[#D8D6CF] text-base md:text-[20px] font-merriweather">
              {job.job?.client?.walletAddress.slice(0, 4)}...
              {job.job?.client?.walletAddress.slice(-5)}
            </p>
            <div className="flex flex-col">
              <button
                className="text-[#FFD700] text-sm md:text-base"
                onClick={() => handleViewProfile()}
              >
                View Profile
              </button>
              <p className="border-b border-yellow w-full"></p>
            </div>
          </div>
        ) : (
          <div></div>
        )}

        {/* Job Title */}
        <div className="space-y-2 md:space-y-[4px]">
          <h2 className="text-[#F9F1E2] font-alata text-lg md:text-2xl font-bold leading-tight">
            {job.job?.title}
          </h2>

          {/* Job Details - Single Line Layout */}
          <div className="flex items-center text-[10px] md:text-sm text-[#B5B4AD] mb-2 gap-0.5 md:gap-1">
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-1 px-0.5 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/location.svg"}
                alt="location icon"
                width="10"
                height="10"
                className="md:w-[18px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-sm whitespace-nowrap">
                {clientData?.location}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-1 px-0.5 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/language.svg"}
                alt="language icon"
                width="14"
                height="14"
                className="md:w-[14px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-sm whitespace-nowrap">
                {clientData?.language}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-1 px-0.5 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/calendar.svg"}
                alt={"timeline"}
                width="10"
                height="10"
                className="md:w-[18px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-sm whitespace-nowrap">
                {job.job.projectDuration.weeks}w
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-1 px-0.5 md:px-2">
              <Image
                src={"/expertise.svg"}
                alt={job.job.experienceLevel}
                width="10"
                height="10"
                className="md:w-[20px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-sm whitespace-nowrap">
                {job.job.experienceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 md:gap-0">
          <div className="flex gap-x-2 items-center text-[#FFCC6D]">
            <div className="flex">
              <Image
                src="/money-2.png"
                alt="Amount"
                width="16"
                height="16"
                className="md:w-[18px] md:h-[18px]"
              />
            </div>
            <span className="text-[#FFCC6D] text-xl md:text-2xl font-bold font-alata">
              ${job?.job?.price}
              <span className="text-xs md:text-sm font-normal text-[#FFCC6D] ml-1">(Fixed)</span>
            </span>
          </div>
          <span className="text-[#B5B4AD] text-xs md:text-sm ml-6 md:ml-0">
            ≈ ₦{job.job?.price ? (job.job.price * 1500).toLocaleString() : "2,250,000"}
          </span>
        </div>

        <div className="space-y-2 md:space-y-3">
          {/* Start Date */}
          <div className="flex items-center gap-x-2">
            <span className="relative h-[14px] w-[14px] md:h-[20px] md:w-[20px]">
              <Image
                src="/calendar.svg"
                alt="Calendar"
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
              />
            </span>
            <p className="font-merriweather text-xs md:text-sm text-[#B5B4AD]">
              Start Date: {job?.startDate}
            </p>
          </div>

          {/* Status */}
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 bg-[#980F0F] rounded-full mt-0.5"></div>
            <div className="flex flex-col">
              <span className="text-[#F9F1E2] font-medium text-sm md:text-base">
                Ended:
              </span>
              <span className="text-[#B5B4AD] text-xs md:text-sm leading-tight">
                Client closed job without getting an artisan
              </span>
            </div>
          </div>
        </div>

        {/* View Details Button - Now Visible on Mobile */}
        <div className="flex justify-end">
          <button
            className="w-full md:w-fit py-2.5 md:py-2 px-4 uppercase bg-[#262208] rounded-md text-xs md:text-sm text-[#FCF8E3] font-bold"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            View full details
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal closeFn={() => setIsModalOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] w-[95vw] md:w-[60vw] h-[90vh] rounded-xl p-4 relative max-w-md md:max-w-none mx-auto"
          >
            <div className="h-[90%] overflow-y-scroll">
              <GigDetails job={job.job} closeFn={() => setIsModalOpen(false)} />
            </div>
          </AnimatedDiv>
        </Modal>
      )}
    </AnimatedDiv>
  );
};

export default ClosedJob;