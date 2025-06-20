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
import { useGetUserRole } from "@/utils/store";

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

  // Convert to boolean (null becomes false)
  const isArtisan = role === "artisan";
  const isClient = role === "client";
  const isVisitor = role === "";

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
        <JobHeader job={job} />
        <JobDetails job={job} />
        <JobPricing job={job} />
        <JobDescription
          job={job}
          jobId={jobId}
          isExpanded={expandedJobs.has(jobId)}
          onToggle={toggleReadMore}
        />
        <JobTags
          job={job}
          jobId={jobId}
          isExpanded={expandedTags.has(jobId)}
          onToggle={toggleTags}
        />
        <JobActions job={job} onViewDetails={handleViewDetails} />
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
              <JobDetailsModal job={job} onApplyClick={handleApplyClick} />
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
            craftCoinsRequired={50}
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
