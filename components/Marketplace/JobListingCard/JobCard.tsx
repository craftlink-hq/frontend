"use client";
import React, { useState } from "react";
import JobHeader from "./JobHeader";
import JobDetails from "./JobDetails";
import JobPricing from "./JobPricing";
import JobDescription from "./JobDescription";
import JobTags from "./JobTags";
import JobActions from "./JobActions";
import Modal from "./Modal";
import JobDetailsModal from "./JobDetailsModal";
import ApplyConfirmationModal from "./ApplyConfirmationModal";
import ArtisanSignupModal from "./ArtisanSignupModal";
import { JobCardProps } from "@/utils/types";
import { formatRelativeTime } from "@/utils/timeUtils";
import { useGetUserRole } from "@/utils/store";
import useGetRequiredCFT from "@/hooks/GigMarketplace/useGetRequiredCFT";
import useGetGigInfo from "@/hooks/GigMarketplace/useGetGigInfo";
import useApplyForGig from "@/hooks/Gasless/useApplyForGig";
import useHasAppliedForGig from "@/hooks/GigMarketplace/useHasAppliedForGig";
import { useAccount } from "@/lib/thirdweb-hooks";
import { toast } from "sonner";

// Define the return type for job status
interface JobStatus {
  text: string;
  color: string;
}

// Function to determine job status based on smart contract state
const getJobStatus = (gigInfo: ReturnType<typeof useGetGigInfo>): JobStatus => {
  if (!gigInfo) {
    return {
      text: "Loading...",
      color: "#6b7280", // gray
    };
  }

  // Priority order: completed > closed > artisan hired > open
  if (gigInfo.isCompleted) {
    return {
      text: "Completed",
      color: "#6b7280", // gray
    };
  }

  if (gigInfo.isClosed) {
    return {
      text: "Application Closed",
      color: "#dc2626", // red
    };
  }

  // Check if artisan is hired (not zero address)
  if (
    gigInfo.hiredArtisan &&
    gigInfo.hiredArtisan !==
      "0x0000000000000000000000000000000000000000"
  ) {
    return {
      text: "Artisan Assigned",
      color: "#f59e0b", // orange/amber
    };
  }

  // Default: open application
  return {
    text: "Open Application",
    color: "#10b981", // green
  };
};

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const [expandedJobs, setExpandedJobs] = useState<Set<string | number>>(
    new Set()
  );
  const [expandedTags, setExpandedTags] = useState<Set<string | number>>(
    new Set()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const { role } = useGetUserRole();
  const { requiredCFT } = useGetRequiredCFT(job.id as string);
  const gigInfo = useGetGigInfo(job.id as string);

  const { applyForGig, isLoading } = useApplyForGig();
  const { address } = useAccount();
  const { checkHasApplied } = useHasAppliedForGig();

  // Get dynamic status based on smart contract state
  const jobStatus = getJobStatus(gigInfo);

  // Convert to boolean (null becomes false)
  const isArtisan = role === "artisan";
  const isClient = role === "client";
  const isVisitor = role === "";

  // State for relative time that updates automatically
  // Now job.createdAt is a real ISO timestamp from the backend
  const [relativeTime, setRelativeTime] = useState(() =>
    formatRelativeTime(job.createdAt)
  );

  // Update relative time every minute
  React.useEffect(() => {
    const updateRelativeTime = () => {
      setRelativeTime(formatRelativeTime(job.createdAt));
    };

    // Update immediately
    updateRelativeTime();

    // Set up interval to update every minute
    const interval = setInterval(updateRelativeTime, 60000);

    return () => clearInterval(interval);
  }, [job.createdAt]);

  const toggleReadMore = (jobId: string | number): void => {
    const newExpandedJobs = new Set(expandedJobs);
    if (newExpandedJobs.has(jobId)) {
      newExpandedJobs.delete(jobId);
    } else {
      newExpandedJobs.add(jobId);
    }
    setExpandedJobs(newExpandedJobs);
  };

  const toggleTags = (jobId: string | number): void => {
    const newExpandedTags = new Set(expandedTags);
    if (newExpandedTags.has(jobId)) {
      newExpandedTags.delete(jobId);
    } else {
      newExpandedTags.add(jobId);
    }
    setExpandedTags(newExpandedTags);
  };

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleApplyClick = () => {
    console.log("Apply button clicked!", {
      isArtisan,
      isClient,
      isVisitor,
      rawResults: { isArtisan, isClient },
    });

    setIsModalOpen(false); // Close job details modal

    if (role === "artisan") {
        setIsApplyModalOpen(true);
    } else {
        setIsSignupModalOpen(true);
    }
  };

  const handleApplyConfirm = async () => {
    const hasApplied = await checkHasApplied(address as string, job.id as string);
    if (hasApplied) {
      toast.warning("You have already applied for this gig.");
      setIsApplyModalOpen(false);
      return;
    }

    if (gigInfo?.client === address) {
      toast.error("You cannot apply to your own gig.");
      setIsApplyModalOpen(false);
      return;
    }
    await applyForGig(job.id as string);
    
    setIsApplyModalOpen(false);
    // You can add your API call here
  };

  const handleSignupComplete = () => {
    // Handle what happens after user clicks sign in
    setIsSignupModalOpen(false);
  };

  const jobId = job.id || index;

  // Create a job object with updated relative time for child components
  const jobWithRelativeTime = {
    ...job,
    createdAt: relativeTime
  };

  return (
    <>
      <style jsx>{`
        .job-card {
          border-radius: 16px;
          padding: 24px;
          background-color: #f2e8cf0a;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .job-card {
            border-radius: 12px;
            padding: 16px;
            margin: 0 16px 16px 16px;
            background-color: #333333;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        }
        
        @media (max-width: 480px) {
          .job-card {
            margin: 0 12px 12px 12px;
            padding: 14px;
          }
        }
      `}</style>

      <div className="job-card">
        <JobHeader job={jobWithRelativeTime} />
        <JobDetails job={jobWithRelativeTime} />
        <JobPricing job={jobWithRelativeTime} />
        <JobDescription
          job={jobWithRelativeTime}
          jobId={jobId}
          isExpanded={expandedJobs.has(jobId)}
          onToggle={toggleReadMore}
        />
        <JobTags
          job={jobWithRelativeTime}
          jobId={jobId}
          isExpanded={expandedTags.has(jobId)}
          onToggle={toggleTags}
        />
        <JobActions 
          job={jobWithRelativeTime} 
          onViewDetails={handleViewDetails}
          jobStatus={jobStatus} // Pass dynamic status
        />
      </div>

      {/* Job Details Modal */}
      {isModalOpen && (
        <Modal closeFn={() => setIsModalOpen(false)}>
          <div className="bg-[#333333] w-[90vw] h-[90vh] max-w-4xl rounded-xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-[#FCFBF726]">
              <h1 className="text-white font-bold text-xl border-b-2 border-yellow pb-1">
                JOB DETAILS
              </h1>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#B5B4AD] hover:text-white text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <JobDetailsModal job={jobWithRelativeTime} onApplyClick={handleApplyClick} />
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Confirmation Modal - Only for Artisans */}
      {isApplyModalOpen && (
        <Modal closeFn={() => setIsApplyModalOpen(false)}>
          <ApplyConfirmationModal
            onCancel={() => setIsApplyModalOpen(false)}
            onConfirm={handleApplyConfirm}
            isLoading={isLoading}
            craftCoinsRequired={requiredCFT ?? 404}
          />
        </Modal>
      )}

      {/* Artisan Signup Modal - For Clients and Visitors */}
      {isSignupModalOpen && (
        <Modal closeFn={() => setIsSignupModalOpen(false)}>
          <ArtisanSignupModal
            onCancel={() => setIsSignupModalOpen(false)}
            onSignIn={handleSignupComplete}
          />
        </Modal>
      )}
    </>
  );
};

export default JobCard;