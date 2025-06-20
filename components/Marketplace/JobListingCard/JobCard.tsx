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
import { JobCardProps } from "@/utils/types"; // Now uses the complete Job interface
import { formatRelativeTime } from "@/utils/timeUtils";
import { useGetUserRole } from "@/utils/store";
import useGetRequiredCFT from "@/hooks/GigMarketplace/useGetRequiredCFT";

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
  
  // State for relative time that updates automatically
  const [relativeTime, setRelativeTime] = useState(() => 
    formatRelativeTime(job.createdAt)
  );

  const { role } = useGetUserRole();
  const { requiredCFT } = useGetRequiredCFT(job.id as string);

  // Convert to boolean (null becomes false)
  const isArtisan = role === "artisan";
  const isClient = role === "client";
  const isVisitor = role === "";

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
      console.log("Showing apply confirmation modal for artisan");
        setIsApplyModalOpen(true);
    } else {
      console.log("Showing signup modal for non-artisan user");
        setIsSignupModalOpen(true);
    }
  };

  const handleApplyConfirm = () => {
    // Handle the actual application logic here
    console.log("Applying for job:", job.id);
    setIsApplyModalOpen(false);
    // You can add your API call here
  };

  const handleSignupComplete = () => {
    // Handle what happens after user clicks sign in
    console.log("User clicked sign in - redirect to artisan signup/login");
    setIsSignupModalOpen(false);
    // You can add redirect logic here, like:
    // router.push('/artisan/signup');
    // or open another modal for artisan registration
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
        <JobActions job={jobWithRelativeTime} onViewDetails={handleViewDetails} />
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