"use client";
import { Job } from "@/utils/types";
import Image from "next/image";
import React from "react";
import AttachedFiles from "../Marketplace/AttachedFiles";
import { formatDate } from "@/utils/formatDate";
import { IoCloseSharp } from "react-icons/io5";

interface TitleDetails {
  name?: string;
  imgSrc: string;
}

interface GigDetails {
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

const GigDetails = ({ job, closeFn }: { job: Job; closeFn?: () => void }) => {
  const titleDetails: TitleDetails[] = [
    {
      imgSrc: "/location.svg",
      name: job.preferredLocation,
    },
    {
      imgSrc: "/market/tabler_flag.svg",
      name: job.language ? job.language : "English",
    },
     {
      imgSrc: "/market/calendar-tick.svg",
      name: `${job.projectDuration.weeks} weeks`,
    },
    {
      imgSrc: "/market/medal-star.svg",
      name: job.experienceLevel,
    },
  ];

  const displayPrice = job.price ? job.price : 404;
  const gigDetails: GigDetails[] = [
    {
      imgSrc: "/money.svg",
      detail: "Budget",
      detailValue: `$${displayPrice}`,
    },
    {
      imgSrc: "/market/medal-star.svg",
      detail: "Experience",
      detailValue: job.experienceLevel,
    },
    {
      imgSrc: "/market/calendar-tick.svg",
      detail: "Duration",
      detailValue: `${job.projectDuration.weeks} weeks`,
    },
  ];
  return (
    <div className="text-start h-full font-merriweather overflow-y-auto w-full flex items-start gap-y-4 flex-col px-4 py-8">
      <div className=" flex w-full border-b bg-about border-[#FFFFFF40] px-2 py-4 justify-between items-center">
        <h1 className="text-[#FCFBF7] font-bold border-b-2 border-yellow  ">
          JOB DETAILS
        </h1>
        <button
          className=" bg-[#3B3A39] rounded-full p-2 text-[#B5B4AD] hover:text-[#F9F1E2] transition-colors"
          onClick={closeFn}
        >
          <IoCloseSharp size={16} />
        </button>
      </div>
      <div className="  w-full flex flex-col items-start p-4 bg-[#F2E8CF0A] rounded-lg">
        <span className="italic font-merriweather text-fontPrimary text-sm py-2 pt-4">
          Job dropped: {formatDate(job.createdAt)}
        </span>
        <h3 className="font-alata text-2xl md:text-3xl text-fontPrimary">
          {job.title}
        </h3>
        <div className="flex w-[90%] 2xl:w-[70%] gap-x-4 py-2 ">
          {titleDetails.map((details, index) => (
            <div
              key={details.imgSrc}
              className={`flex gap-x-2 justify-center items-center w-fit px-4 md:px-2 gap-x-2 ${
                index == 3 ? "border-0" : "border-r border-[#FCFBF726] "
              }`}
            >
              <Image
                src={details.imgSrc}
                alt={"Icon"}
                width="16"
                height="16"
              />
              <span className="font-merriweather text-center text-[#D8D6CF]">
                {details.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="font-merriweather w-full self-start space-y-4 p-4 bg-[#F2E8CF0A] rounded-lg">
        <p className="text-[#B5B4AD] text-start">DETAILED DESCRIPTION</p>
        <p className="text-[#D8D6CF] whitespace-pre-wrap text-start font-merriweather w-full px-2">
          {job.projectDescription}
        </p>
      </div>
      <div className="py-8 font-merriweather w-full self-start p-4 bg-[#F2E8CF0A] rounded-lg text-fontPrimary flex flex-wrap gap-4">
        {gigDetails.map((details) => (
          <div
            key={details.detail}
            className="rounded-xl xl:w-[25%] grid gap-y-4 p-4 border border-[#FCFBF726]"
          >
            <div className="flex gap-x-2">
              <Image
                src={details.imgSrc}
                alt={details.detail}
                width="22"
                height="22"
              />
              <span className="font-bold text-[#B5B4AD]">{details.detail}</span>
            </div>
            <span className="capitalize text-start text-[#F9F1E2] text-lg">
              {details.detailValue}
            </span>
          </div>
        ))}
      </div>
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        <p className="text-[#B5B4AD] text-start">REQUIRED SKILLS</p>
        <div className="flex flex-wrap py-4 gap-4 h-fit">
          {job?.skillCategory?.map((tag) => (
            <span
              className="bg-[#26220826] text-[#D8D6CF] border self-center rounded-full text-center border-[#FFFFFF40] text-sm  p-[10px] w-fit"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-[#F2E8CF0A] text-start rounded-lg w-full p-4 space-y-4">
        <p className="text-[#B5B4AD]">ADDITIONAL NOTES</p>
        <p className="text-[#D8D6CF] w-full px-2">
          {job.additionalProjectInfo
            ? job.additionalProjectInfo
            : "NONE PROVIDED"}
        </p>
      </div>
      <div className="bg-[#F2E8CF0A] text-start rounded-lg w-full p-4 h-fit">
        <p className="text-[#B5B4AD]">ATTACHED FILES</p>
        <div className="flex flex-wrap justify-start gap-x-4 w-full h-fit py-2">
          <AttachedFiles files={job.files} />
        </div>
      </div>
    </div>
  );
};
export default GigDetails;
