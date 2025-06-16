"use client";
import { useState } from "react";
import { Applied } from "@/utils/job";
import Image from "next/image";
import AnimatedDiv from "@/components/AnimatedDiv";
import { formatDate } from "@/utils/formatDate";
import ActiveJobSidebar from "./ActiveJobSidebar";
import { FilterProps } from "@/utils/filters";

const filters: FilterProps[] = [
  { filter: "Status", options: ["Accepted", "In Progress", "Pending Start"] },
  { filter: "Location", options: ["Remote", "On-site", "Hybrid", "Local", "International"] },
  { filter: "Sort By", options: ["Date", "Price", "Relevance"] }
];

const DisputedJobCard = ({ job }: { job: Applied }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const handleOpenDetailsModal = () => {
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <AnimatedDiv
      initialX="100%"
      animateX={0}
      exitX={"-100%"} 
      duration={1.0}
      className="hover:bg-[#F2E8CF0A] bg-[#F2E8CF0A] border border-[#FCFBF726] w-full rounded-xl flex flex-col p-6 gap-y-4"
    >
      {/* Posted Date - Top Left with Cyan Background */}
      <div className="flex justify-start">
        <div className="bg-[#4AC7CB] bg-opacity-20 px-3 py-1 rounded">
          <span className="text-[#4AC7CB] text-sm italic">
            Posted: {formatDate(job.job?.createdAt) || "Two weeks ago"}
          </span>
        </div>
      </div>

      {/* Dispute Raised By Section */}
      <div className="flex flex-col gap-y-1">
        <span className="text-[#B5B4AD] text-sm">Dispute raised by: Artisan</span>
        <span className="text-[#F9F1E2] text-lg font-alata">
          {job.job?.client?.walletAddress.slice(0, 4)}...{job.job?.client?.walletAddress.slice(-4)}
        </span>
      </div>

      {/* Job Title - Large and Prominent */}
      <div className="w-full">
        <h3 className="font-merriweather text-2xl md:text-3xl text-white leading-tight">
          {job.job?.title}
        </h3>
      </div>

      {/* Job Details Row - Icons with Labels */}
      <div className="flex items-center gap-x-6 text-sm text-[#B5B4AD] flex-wrap">
        <div className="flex items-center gap-x-2">
          <span className="relative h-4 w-4">
            <Image
              src="/location.png"
              alt="Location"
              fill
              style={{ objectFit: "contain" }}
            />
          </span>
          <span>{job.job?.preferredLocation || "Lagos, Nigeria"}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="relative h-4 w-4">
            <Image
              src="/language.png"
              alt="Language"
              fill
              style={{ objectFit: "contain" }}
            />
          </span>
          <span>{job.job?.language || "English"}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="relative h-4 w-4">
            <Image
              src="/market/calendar-tick.svg"
              alt="Duration"
              fill
              style={{ objectFit: "contain" }}
            />
          </span>
          <span>{job.job?.projectDuration?.weeks ? `${job.job.projectDuration.weeks} Weeks` : "2 Weeks"}</span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="relative h-4 w-4">
            <Image
              src="/market/medal-star.svg"
              alt="Skill"
              fill
              style={{ objectFit: "contain" }}
            />
          </span>
          <span>{job.job?.experienceLevel || "Intermediate"}</span>
        </div>
      </div>

      {/* Bottom Section: 4-Column Grid + Button */}
      <div className="flex justify-between items-end">
        {/* Dispute Details Grid - 4 Columns with Separating Lines */}
        <div className="flex text-sm flex-1 divide-x divide-[#FCFBF726]">
          <div className="flex flex-col pr-8">
            <span className="text-[#B5B4AD] mb-2">Raised Date:</span>
            <span className="text-[#F9F1E2] font-bold text-lg">
              {job?.disputeRaisedDate || "13/12/24"}
            </span>
          </div>
          <div className="flex flex-col px-8">
            <span className="text-[#B5B4AD] mb-2">Dispute Type:</span>
            <span className="text-[#F9F1E2] font-medium italic">
              {job?.disputeType || "Payment not released"}
            </span>
          </div>
          <div className="flex flex-col px-8">
            <span className="text-[#B5B4AD] mb-2">Budget:</span>
            <div className="flex items-center gap-x-2">
              <span className="relative h-5 w-5">
                <Image
                  src="/market/money-2.svg"
                  alt="Price"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </span>
              <span className="text-[#FFD700] font-bold text-lg">
                ${job.job?.price || "1500"}<span className="text-sm font-normal">(Fixed)</span>
              </span>
            </div>
          </div>
          <div className="flex flex-col pl-8">
            <span className="text-[#B5B4AD] mb-2">Resolution Status:</span>
            <div className="flex items-center gap-x-2">
              <div className="bg-[#04DF76] h-3 w-3 rounded-full flex-shrink-0"></div>
              <span className="text-[#B5B4AD] text-sm font-medium">
                {job?.disputeStatus === 'resolved' 
                  ? "Resolved: Payment Released to Artisan"
                  : "Pending: Awaiting Client Action"
                }
              </span>
            </div>
          </div>
        </div>

        {/* View Full Details Button - Bottom Right */}
        <div className="flex-shrink-0 ml-8">
          <button 
            onClick={handleOpenDetailsModal}
            className="bg-[#262208] hover:bg-[#333316] text-[#F9F1E2] px-6 py-2 rounded text-sm font-medium transition-colors uppercase"
          >
            VIEW FULL DETAILS
          </button>
        </div>
      </div>

      {/* Details Modal - You can implement this later */}
      {/* <DisputeDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        job={job}
      /> */}
    </AnimatedDiv>
  );
};

const DisputedJob = ({ jobs }: { jobs: Applied[] }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header section - full width */}
      <div className="font-merriweather text-[#F9F1E2] px-4 md:px-8 xl:px-16 py-8">
        <h2 className="font-bold text-lg">Resolve Outstanding Disputes</h2>
        <h4 className="text-sm text-[#F9F1E2]">
          View and manage jobs currently under dispute. Respond to claims,
          upload evidence, or track resolution updates.
        </h4>
      </div>

      {/* Main content area with sidebar and content */}
      <div className="flex flex-1">
        {jobs && jobs.length > 0 ? (
          <>
            {/* Sidebar - 25% width */}
            <div className="w-1/4 h-full">
              <ActiveJobSidebar filters={filters} />
            </div>
            
            {/* Main content - 75% width */}
            <div className="w-3/4 h-full overflow-y-auto">
              {/* Scrollable container for disputed jobs */}
              <div className="h-full overflow-y-auto px-4 md:px-8 xl:px-16 py-8">
                <div className="space-y-6">
                  {/* Disputed Job Cards */}
                  {jobs.map((job, index) => (
                    <DisputedJobCard key={`disputed-job-${index}`} job={job} />
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          // No sidebar when no jobs - full width but centered content
          <div className="w-full h-full overflow-y-auto flex items-center justify-center">
            <div 
              className="bg-[#F2E8CF0A] border border-[#FCFBF726] rounded-2xl p-10 flex flex-col items-center justify-center text-center"
              style={{ 
                width: '600px', 
                height: '470px',
                gap: '24px'
              }}
            >
              {/* Custom NoJob Content for Constrained Container */}
              <div>
                <p className="font-bold text-2xl text-[#F9F1E2] font-merriweather mb-2">
                  You have no disputed jobs currently.
                </p>
                <p className="text-[#F9F1E2] font-merriweather">
                  All your jobs are going smoothly! If an issue arises, it will appear here for resolution.
                </p>
              </div>
              
              <div className="relative w-48 h-48">
                <Image
                  src="/disputed.png"
                  alt="No disputed jobs"
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
                {/* Faint yellow line under the image */}
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 w-full h-px opacity-30"
                  style={{ 
                    backgroundColor: '#FFD700', 
                    top: '100%', 
                    marginTop: '1rem' 
                  }}
                ></div>
              </div>

              <button 
                className="rounded-md text-[#1A1203] px-6 py-2 font-bold font-merriweather hover:opacity-90 transition-opacity duration-200"
                style={{ backgroundColor: '#FFD700' }}
              >
                BROWSE JOBS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputedJob;
export { DisputedJobCard };