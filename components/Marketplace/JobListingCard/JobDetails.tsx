"use client";
import React from "react";
import { FiMapPin } from "react-icons/fi";
import { JobDetailsProps } from "@/utils/types";
import Image from "next/image";

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  const formatDuration = (weeks: number): string => {
    if (weeks === 1) return "1 Week";
    return `${weeks} Weeks`;
  };

  return (
    <>
      <style jsx>{`
        .job-details {
          font-family: Merriweather;
          font-weight: 400;
          font-size: 16px;
          line-height: 120%;
          letter-spacing: 0%;
          color: #D8D6CF;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .job-details {
            font-size: 12px;
            color: #B5B4AD;
            font-weight: 400;
          }
          
          .job-details-container {
            gap: 12px;
            margin-bottom: 12px;
          }
          
          .job-details-item {
            gap: 4px;
          }
          
          .job-details-icon {
            width: 12px;
            height: 12px;
            opacity: 0.8;
          }
        }
      `}</style>
      
      {/* Job Details Row */}
      <div className="flex items-center gap-4 mb-4 job-details-container">
        <div className="flex items-center gap-1 job-details-item">
          <FiMapPin className="w-3 h-3 job-details-icon" />
          <span className="job-details">{job.preferredLocation}</span>
        </div>
        <div className="flex items-center gap-1 job-details-item">
          <Image src="/market/tabler_flag.svg" alt="Language" width={12} height={12} className="job-details-icon" />
          <span className="job-details">{job.language}</span>
        </div>
        <div className="flex items-center gap-1 job-details-item">
          <Image src="/market/calendar-tick.svg" alt="Duration" width={12} height={12} className="job-details-icon" />
          <span className="job-details">{formatDuration(job.projectDuration.weeks)}</span>
        </div>
        <div className="flex items-center gap-1 job-details-item">
          <Image src="/market/medal-star.svg" alt="Experience" width={12} height={12} className="job-details-icon" />
          <span className="job-details">{job.experienceLevel}</span>
        </div>
      </div>
    </>
  );
};

export default JobDetails;