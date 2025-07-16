"use client";
import React from "react";
import { FaCheckCircle, FaCircle } from "react-icons/fa";
import { JobActionsProps } from "@/utils/types";

// Extend existing JobActionsProps with new properties
interface UpdatedJobActionsProps extends JobActionsProps {
  onViewDetails: () => void;
  jobStatus: {
    text: string;
    color: string;
  };
}

const JobActions: React.FC<UpdatedJobActionsProps> = ({ job, onViewDetails, jobStatus }) => {
  return (
    <>
      {/* Status and Action Row */}
      <div className="flex flex-col gap-3 items-stretch md:flex-row md:items-center md:justify-between md:gap-0">
        <div className="flex items-center gap-6 md:gap-8">
          {/* Secured Payment */}
          <div className="flex items-center gap-1">
            <FaCheckCircle className="w-3 h-3" style={{ color: '#fbbf24' }} />
            <span className="text-xs md:text-sm font-normal italic leading-tight text-[#FCF7F7]" style={{ fontFamily: 'Merriweather' }}>
              {job.payment}
            </span>
          </div>
          
          {/* Dynamic Application Status */}
          <div className="flex items-center gap-1">
            <FaCircle className="w-3 h-3" style={{ color: jobStatus.color }} />
            <span className="text-xs md:text-sm font-normal italic leading-tight text-[#FCF7F7]" style={{ fontFamily: 'Merriweather' }}>
              {jobStatus.text}
            </span>
          </div>
        </div>

        <button 
          className="w-[calc(100%-8px)] h-10 px-5 py-2 text-xs rounded-md md:w-80 md:h-11 md:px-6 md:py-3 md:rounded font-medium text-white bg-[#262208] hover:opacity-90 transition-opacity"
          onClick={onViewDetails}
        >
          View Details
        </button>
      </div>
    </>
  );
};

export default JobActions;