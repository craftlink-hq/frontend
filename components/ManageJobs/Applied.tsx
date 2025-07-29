"use client";
import { Applied } from "@/utils/types";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../Modal";
import GigDetails from "./GigDetails";
import AnimatedDiv from "@/components/AnimatedDiv";
import { formatRelativeTime } from "@/utils/timeUtils";
import useGetClientInfo from "@/hooks/ManageJob/useGetClientInfo";
import { useRouter } from "next/navigation"

const AppliedJob = ({ job }: { job: Applied }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clientData } = useGetClientInfo(job.job.client?.walletAddress || "");
  const router = useRouter()

  const handleViewProfile = (clientId: string) => {
    // Navigate to specific client profile
    router.push(`/profile/clients/artisan-view/${clientId}`);
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
          Posted: {formatRelativeTime(job.startDate)}
        </span>
      </div>

      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {/* Client Address */}
        <div className="mb-2 flex justify-between items-center">
          <p className="text-[#D8D6CF] text-base md:text-[20px] font-merriweather">
            {job.job.client?.walletAddress.slice(0, 4)}...
            {job.job.client?.walletAddress.slice(-5)}
          </p>
          <button
            className="flex flex-col"
            onClick={() => handleViewProfile(clientData?.walletAddress || "")}
          >
            <span className="text-[#FFD700] text-sm md:text-base">View Profile</span>
            <p className="border-b border-yellow w-full"></p>
          </button>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <h2 className="text-[#F9F1E2] font-alata text-lg md:text-2xl font-bold leading-tight">
            {job.job.title}
          </h2>

          {/* Job Details - Single Line Layout */}
          <div className="flex items-center text-[10px] md:text-[14px] text-[#B5B4AD] mb-2 gap-0.5 md:gap-1">
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/location.svg"}
                alt={clientData?.location || "Not specified"}
                width="10"
                height="10"
                className="md:w-[18px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-[14px] whitespace-nowrap">
                {clientData?.location}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/language.svg"}
                alt={"language"}
                width="14"
                height="14"
                className="md:w-[14px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-[14px] whitespace-nowrap">
                {clientData?.language || "Not specified"}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/calendar.svg"}
                alt={"timeline"}
                width="10"
                height="10"
                className="md:w-[18px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-[14px] whitespace-nowrap">
                {job.job.projectDuration.weeks} weeks
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-0.5 md:gap-x-2 px-0.5 md:px-2">
              <Image
                src={"/expertise.svg"}
                alt={job.job.experienceLevel}
                width="10"
                height="10"
                className="md:w-[20px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-[10px] md:text-[14px] whitespace-nowrap">
                {job.job.experienceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex gap-x-2 items-center text-[#FFCC6D]">
          <div className="flex">
            <Image
              src="/money.svg"
              alt="Amount"
              width="16"
              height="16"
              className="md:w-[18px] md:h-[18px]"
            />
          </div>
          <span className="text-[#FFCC6D] text-xl md:text-2xl font-bold font-alata">
            ${job.job.price}
            <span className="text-xs md:text-sm font-normal text-[#FFCC6D] ml-1">(Fixed)</span>
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FAB427] rounded-full"></div>
          <span className="text-[#F9F1E2] font-medium capitalize text-sm md:text-base">
            {job.status}:{" "}
            <span className="text-[#B5B4AD] text-xs md:text-base">{job.statusMsg}</span>
          </span>
        </div>

        {/* View Details Button - Now Visible on Mobile */}
        <div className="flex justify-end">
          <button
            className="w-full md:w-fit py-2.5 md:py-2 px-4 uppercase bg-[#262208] rounded-md text-xs md:text-sm text-[#FCF8E3] font-bold"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            View Full Details
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

export default AppliedJob;