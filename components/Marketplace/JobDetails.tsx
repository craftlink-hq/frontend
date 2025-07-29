"use client";
import { Job } from "@/utils/types";
import Image from "next/image";
import Modal from "../Modal";
import AnimatedDiv from "@/components/AnimatedDiv";
import React, { useState } from "react";
import AttachedFiles from "./AttachedFiles";
import Apply from "./Apply";
import ClientDetails from "./ClientDetails";
import { MdOutlineReport } from "react-icons/md";
import { formatDate } from "@/utils/formatDate";

interface TitleDetails {
  name?: string;
  imgSrc: string;
}

interface JobDetails {
  detail: string;
  detailValue?: string;
  imgSrc: string;
}

export interface Client {
  walletAddress: string;
  verificationStatus: boolean;
  dateJoined: string;
  description?: string;
}

const JobDetails = ({ job }: { job: Job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const client: Client = {
    walletAddress: job.clientAddress || "",
    verificationStatus: true,
    dateJoined: job.createdAt,
    description: job.clientDescription,
  };

  const titleDetails: TitleDetails[] = [
    {
      imgSrc: "/location.svg",
      name: job.preferredLocation,
    },
    {
      imgSrc: "/language.svg",
      name: job.language ? job.language : "English",
    },
    {
      imgSrc: "/totalJobs.png",
      name:
        job?.totalJobs && job?.totalJobs > 1
          ? `${job.totalJobs} jobs posted`
          : "Amount Verified",
    },
  ];

  const displayPrice = job.price ? job.price / 1000000 : 0;
  const jobDetails: JobDetails[] = [
    {
      imgSrc: "/money.svg",
      detail: "Budget",
      detailValue: `$${displayPrice}`,
    },
    {
      imgSrc: "/expertise.svg",
      detail: "Experience",
      detailValue: job.experienceLevel,
    },
    {
      imgSrc: "/calendar.svg",
      detail: "Duration",
      detailValue: `${job.projectDuration.weeks} weeks`,
    },
  ];
  return (
    <div className="text-start h-full  overflow-y-scroll font-merriweather w-full flex items-start gap-y-4 flex-col px-4 py-8">
      <h1 className="text-[#FCFBF7] font-bold border-b-2 border-yellow text-base sm:text-sm md:text-lg">
        JOB DETAILS
      </h1>
      <div className=" w-full flex flex-col items-start p-4 bg-[#F2E8CF0A] rounded-lg">
        <span className="italic font-merriweather text-fontPrimary text-sm py-2 pt-4 sm:text-xs md:text-sm">
          Job dropped: {formatDate(job.createdAt)}
        </span>
        <h3 className="font-alata text-2xl md:text-3xl text-fontPrimary sm:text-lg">
          {job.title}
        </h3>
        <div className="flex w-[90%] 2xl:w-[70%] gap-x-4 py-2 ">
          {titleDetails.map((details, index) => (
            <div
              key={details.imgSrc}
              className={`flex justify-center items-center min-w-[28%] 2xl:min-w-[20%] w-fit px-4 md:px-2 gap-x-2 ${
                index == 2 ? "border-0" : "border-r border-[#FCFBF726] "
              }`}
            >
              <span className="font-merriweather text-center text-[#D8D6CF] text-sm sm:text-xs md:text-base">
                {details.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="font-merriweather w-full self-start p-4 bg-[#F2E8CF0A] rounded-lg">
        <p className="text-[#B5B4AD] text-start text-sm sm:text-xs md:text-base">DETAILED DESCRIPTION</p>
        <p className="text-[#D8D6CF] whitespace-pre-wrap text-start font-merriweather w-full px-2 text-sm sm:text-xs md:text-base">
          {job.projectDescription}
        </p>
      </div>
      <div className="py-8 font-merriweather w-full self-start p-4 bg-[#F2E8CF0A] rounded-lg text-fontPrimary flex flex-wrap gap-4">
        {jobDetails.map((details) => (
          <div
            key={details.detail}
            className="rounded-xl xl:w-[25%] grid gap-y-4 p-4 border border-[#FCFBF726]"
          >
            <div className="flex gap-x-2">
              <Image
                src={details.imgSrc}
                alt={details.detail}
                width="30"
                height="22"
                className="sm:w-5 sm:h-4 md:w-[30px] md:h-[22px]"
              />
              <span className="font-bold text-[#B5B4AD] text-base sm:text-xs md:text-base">{details.detail}</span>
            </div>
            <span className="capitalize text-start text-[#F9F1E2] text-lg sm:text-sm md:text-lg">
              {details.detailValue}
              {/* {details.detail == "Budget" && (
                <span className="text-[#B5B4AD] font-normal text-base">
                  ({job.price})
                </span>
              )} */}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        <p className="text-[#B5B4AD] text-start text-sm sm:text-xs md:text-base">REQUIRED SKILLS</p>
        <div className="flex flex-wrap py-4 gap-4 h-fit">
          {job?.skillCategory?.map((tag) => (
            <span
              className="bg-[#26220826] text-[#D8D6CF] border self-center rounded-full text-center border-[#FFFFFF40] text-sm p-[10px] w-fit sm:text-xs sm:p-2 md:text-sm md:p-[10px]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-[#F2E8CF0A] text-start rounded-lg w-full p-4">
        <p className="text-[#B5B4AD] text-sm sm:text-xs md:text-base">ADDITIONAL NOTES</p>
        <p className="text-[#D8D6CF] w-full px-2 text-sm sm:text-xs md:text-base">{job.additionalProjectInfo}</p>
      </div>
      <div className="bg-[#F2E8CF0A] text-start rounded-lg w-full p-4 h-fit">
        <p className="text-[#B5B4AD] text-sm sm:text-xs md:text-base">ATTACHED FILES</p>
        <div className="flex flex-wrap justify-start gap-x-4 w-full h-[10vh] py-2">
          <AttachedFiles files={job.files} />
        </div>
      </div>
      <div className="flex gap-x-4">
        <button
          className="bg-yellow text-[#1A1203] font-merriweather font-bold rounded-md text-[#1A1203] py-2 px-4 text-sm sm:text-xs sm:py-1 sm:px-3 md:text-base md:py-2 md:px-4"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Apply For Job
        </button>
        <button className="flex gap-x-2 items-center text-sm sm:text-xs md:text-base">
          <MdOutlineReport color={"#E5D1D1"} size={22} className="sm:w-4 sm:h-4 md:w-[22px] md:h-[22px]" /> <p>Report this Job</p>
        </button>
      </div>
      <div className="w-full">
        <ClientDetails client={client} />
      </div>
      {isModalOpen && (
        <Modal closeFn={() => setIsModalOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] md:w-[50vw] rounded-xl p-4  relative  "
          >
            <Apply onCancel={() => setIsModalOpen(false)} databaseId={String(job.id)} />
          </AnimatedDiv>
        </Modal>
      )}
    </div>
  );
};
export default JobDetails;