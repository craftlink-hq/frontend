"use client";
import { Applied } from "@/utils/types";
import Image from "next/image";
import React, { useState } from "react";
import Modal from "../Modal";
import GigDetails from "./GigDetails";
import AnimatedDiv from "@/components/AnimatedDiv";
import { formatDate } from "@/utils/formatDate";
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
      className="group hover:bg-[#F2E8CF0A] border border-[#FCFBF726] w-[92%] md:w-full rounded-xl flex flex-col gap-y-2 font-merriweather"
    >
      {/* Posted Date */}
      <div className="w-full bg-[#403F3E] p-4">
        <span className="text-sm bg-[#00F7FF17] text-[#47F9FF] italic rounded-md p-[10px]">
          Posted: {formatDate(job.startDate)}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Client Address */}
        <div className="mb-2 flex justify-between">
          <p className="text-[#D8D6CF] text-[20px] font-merriweather">
            {job.job.client?.walletAddress.slice(0, 4)}...
            {job.job.client?.walletAddress.slice(-5)}
          </p>
          <button
            className="flex flex-col gap-x-2"
            onClick={() => handleViewProfile(clientData?.walletAddress || "")}
          >
            <span className="text-[#FFD700]">View Profile</span>
            <p className="border-b border-yellow w-full"></p>
          </button>
        </div>

        {/* Job Title */}
        <div className="space-y-2">
          <h2 className="text-[#F9F1E2] font-alata text-2xl font-bold">
            {job.job.title}
          </h2>

          {/* Job Details */}
          <div className="flex items-center text-[14px] text-[#B5B4AD] mb-2">
            <div className="flex justify-center items-center gap-x-2 px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/location.png"}
                alt={clientData?.location || "Not specified"}
                width="18"
                height="16"
              />
              <span className="font-merriweather text-[#D8D6CF]">
                {clientData?.location}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-2 px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/language.png"}
                alt={"language"}
                width="14"
                height="16"
              />
              <span className="font-merriweather text-[#D8D6CF]">
                {clientData?.language || "Not specified"}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-2 px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/calendar.png"}
                alt={"timeline"}
                width="18"
                height="16"
              />
              <span className="font-merriweather text-[#D8D6CF]">
                {job.job.projectDuration.weeks} weeks
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-2 px-2">
              <Image
                src={"/expertise.png"}
                alt={job.job.experienceLevel}
                width="20"
                height="16"
              />
              <span className="font-merriweather text-[#D8D6CF]">
                {job.job.experienceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex gap-x-2 items-center text-[#FFCC6D]">
          <div className="flex">
            <Image
              src="/money-2.png"
              alt="Amount"
              width="18"
              height="18"
              className="hidden md:flex"
            />
          </div>
          <span className="text-[#FFCC6D] text-2xl font-bold font-alata">
            ${job.job.price}
            <span className="text-sm font-normal text-[#FFCC6D]">(Fixed)</span>
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#FAB427] rounded-full"></div>
          <span className="text-[#F9F1E2] font-medium">
            {job.status}:{" "}
            <span className="text-[#B5B4AD]">{job.statusMsg}</span>
          </span>
        </div>

        <div className="flex justify-end">
          <button
            className="hidden md:flex w-fit py-2 px-4 uppercase bg-[#262208] rounded-md text-sm md:text-base text-[#FCF8E3] font-bold"
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
            className="bg-[#333333] border border-[#FCFBF726] md:w-[60vw] h-[90vh] rounded-xl p-4 relative"
          >
            <div className="h-[90%] overflow-y-scroll">
              <GigDetails job={job.job} />
            </div>
          </AnimatedDiv>
        </Modal>
      )}
    </AnimatedDiv>
  );
};

export default AppliedJob;
