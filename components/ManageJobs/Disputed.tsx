"use client";
import { Applied } from "@/utils/types";
import Image from "next/image";
import AnimatedDiv from "@/components/AnimatedDiv";
import { formatRelativeTime } from "@/utils/timeUtils";
import { useState } from "react";
import Modal from "../Modal";
import { useFetchArtisanDisputedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanDisputedGigs";

const DisputedJobCard = ({ job }: { job: Applied }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { disputedGigs } = useFetchArtisanDisputedGigs();
  console.log("Disputed Gigs:", disputedGigs);

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <AnimatedDiv
      initialX="100%"
      animateX={0}
      exitX={"-100%"} 
      duration={1.0}
      className="hover:bg-[#F2E8CF0A] bg-[#F2E8CF0A] border border-[#FCFBF726] w-[92%] md:w-full rounded-xl flex flex-col p-4 md:p-6 gap-y-3 md:gap-y-4 overflow-hidden"
    >
      {/* Posted Date - Top Left with Cyan Background */}
      <div className="flex justify-start">
        <div className="bg-[#4AC7CB] bg-opacity-20 px-2 md:px-3 py-1 rounded">
          <span className="text-[#4AC7CB] text-xs md:text-sm italic">
            Posted: {formatRelativeTime(job.job?.createdAt) || "Two weeks ago"}
          </span>
        </div>
      </div>

      {/* Dispute Raised By Section */}
      <div className="flex flex-col gap-y-1">
        <span className="text-[#B5B4AD] text-xs md:text-sm">Dispute raised by: Artisan</span>
        <span className="text-[#F9F1E2] text-base md:text-lg font-alata">
          {job.job?.client?.walletAddress.slice(0, 4)}...{job.job?.client?.walletAddress.slice(-4)}
        </span>
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
          <span className="whitespace-nowrap">{job.job?.projectDuration?.weeks ? `${job.job.projectDuration.weeks}w` : "2w"}</span>
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

      {/* Bottom Section: Responsive Layout */}
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        {/* Dispute Details - Mobile: Stacked, Desktop: 4 Columns */}
        <div className="flex flex-col gap-3 md:flex md:text-sm md:flex-1 md:divide-x md:divide-[#FCFBF726] md:gap-0 md:flex-row">
          <div className="flex flex-col md:pr-8">
            <span className="text-[#B5B4AD] mb-1 text-xs md:text-sm">Raised Date:</span>
            <span className="text-[#F9F1E2] font-bold text-sm md:text-lg">
              {job?.disputeRaisedDate || "13/12/24"}
            </span>
          </div>
          <div className="flex flex-col md:px-8">
            <span className="text-[#B5B4AD] mb-1 text-xs md:text-sm">Dispute Type:</span>
            <span className="text-[#F9F1E2] font-medium italic text-xs md:text-base">
              {job?.disputeType || "Payment not released"}
            </span>
          </div>
          <div className="flex flex-col md:px-8">
            <span className="text-[#B5B4AD] mb-1 text-xs md:text-sm">Budget:</span>
            <div className="flex items-center gap-x-2">
              <span className="relative h-4 w-4 md:h-5 md:w-5">
                <Image
                  src="/market/money-2.svg"
                  alt="Price"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </span>
              <span className="text-[#FFD700] font-bold text-sm md:text-lg">
                ${job.job?.price || "1500"}<span className="text-xs md:text-sm font-normal">(Fixed)</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col md:pl-8">
            <span className="text-[#B5B4AD] mb-1 text-xs md:text-sm">Resolution Status:</span>
            <div className="flex items-center gap-x-2">
              <div className="bg-[#04DF76] h-3 w-3 rounded-full flex-shrink-0"></div>
              <span className="text-[#B5B4AD] text-xs md:text-sm font-medium">
                {job?.disputeStatus === 'resolved' 
                  ? "Resolved: Payment Released to Artisan"
                  : "Pending: Awaiting Client Action"
                }
              </span>
            </div>
          </div>
        </div>

        {/* View Full Details Button */}
        <div className="flex-shrink-0 md:ml-8">
          <button 
            onClick={() => setIsDetailsModalOpen(true)}
            className="w-full md:w-auto bg-[#262208] hover:bg-[#333316] text-[#F9F1E2] px-4 md:px-6 py-2 rounded text-xs md:text-sm font-medium transition-colors uppercase"
          >
            VIEW FULL DETAILS
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {isDetailsModalOpen && (
        <Modal closeFn={handleCloseDetailsModal}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] w-[95vw] md:w-[40vw] lg:w-[35vw] max-w-md md:max-w-lg rounded-xl p-4 md:p-6 relative max-h-[90vh] overflow-y-auto mx-auto"
          >
            {/* Job Title */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-white text-lg md:text-xl font-semibold mb-2">{job.job?.title}</h3>
              <p className="text-[#B5B4AD] text-xs md:text-sm">Posted: {formatRelativeTime(job.job?.createdAt)}</p>
            </div>

            {/* Dispute Information */}
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <span className="text-[#B5B4AD] text-xs md:text-sm block mb-1">Raised Date:</span>
                  <span className="text-white font-medium text-sm md:text-base">{job?.disputeRaisedDate || "13/12/24"}</span>
                </div>
                <div>
                  <span className="text-[#B5B4AD] text-xs md:text-sm block mb-1">Dispute Type:</span>
                  <span className="text-white font-medium text-sm md:text-base">{job?.disputeType || "Payment not released"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <span className="text-[#B5B4AD] text-xs md:text-sm block mb-1">Budget:</span>
                  <span className="text-[#FFD700] font-bold text-sm md:text-base">${job.job?.price || "1500"} (Fixed)</span>
                </div>
                <div>
                  <span className="text-[#B5B4AD] text-xs md:text-sm block mb-1">Status:</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#04DF76] h-2 w-2 rounded-full"></div>
                    <span className="text-[#B5B4AD] text-xs md:text-sm">
                      {job?.disputeStatus === 'resolved' 
                        ? "Resolved" 
                        : "Pending"
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="border-t border-[#FCFBF726] pt-3 md:pt-4">
                <span className="text-[#B5B4AD] text-xs md:text-sm block mb-2">Client:</span>
                <span className="text-white font-medium text-sm md:text-base">
                  {job.job?.client?.walletAddress.slice(0, 4)}...{job.job?.client?.walletAddress.slice(-4)}
                </span>
              </div>

              {/* Description */}
              <div className="border-t border-[#FCFBF726] pt-3 md:pt-4">
                <span className="text-[#B5B4AD] text-xs md:text-sm block mb-2">Dispute Description:</span>
                <p className="text-white text-xs md:text-sm leading-relaxed">
                  The artisan has completed the work as specified but the client has not released the payment. This dispute has been raised to resolve the payment issue and ensure fair compensation for the completed work.
                </p>
              </div>

              {/* Resolution Details */}
              <div className="border-t border-[#FCFBF726] pt-3 md:pt-4">
                <span className="text-[#B5B4AD] text-xs md:text-sm block mb-2">Resolution:</span>
                <p className="text-[#04DF76] text-xs md:text-sm">
                  {job?.disputeStatus === 'resolved' 
                    ? "Payment has been released to the artisan. Dispute resolved successfully."
                    : "Awaiting client action to resolve this dispute."
                  }
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-[#FCFBF726]">
              <button
                onClick={handleCloseDetailsModal}
                className="w-full bg-[#FFD700] text-[#1A1203] py-2 px-4 rounded font-medium hover:bg-[#E6C200] transition-colors text-sm md:text-base"
              >
                CLOSE
              </button>
            </div>
          </AnimatedDiv>
        </Modal>
      )}
    </AnimatedDiv>
  );
};

export default DisputedJobCard;