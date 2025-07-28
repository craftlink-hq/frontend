"use client";
import Filter from "@/components/Marketplace/Filter";
import { useFilterState } from "@/context/filter";
import type { FilterProps } from "@/utils/filters";
import ApplicantCard from "./ApplicantCard";
import NoJob from "./NoJob";
import Pagination from "./JobsPagination";
import { useMemo } from "react";
import type { Artisan, Job } from "@/utils/types";
import { useCloseGig } from "@/hooks/Gasless/useCloseGig";
import Loading from "../Loading";

interface ManageApplicantsProps {
  applicants?: Artisan[];
  job: Job;
  title?: string;
  desc?: string;
  imageSrc?: string;
  filters: FilterProps[];
  jobType: string;
  pageDetails?: string;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
}

const ManageApplicants = ({
  applicants = [],
  job,
  title = "No applications yet",
  desc = "When artisans apply for this job, you'll see them listed here for review.",
  imageSrc = "/placeholder.svg?height=200&width=200",
  filters,
  jobType,
  pageDetails = "Review and manage applications for this job. You can hire artisans directly or start a conversation to learn more about their experience.",
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 4,
  totalItems = 0,
  onPageChange,
  onItemsPerPageChange,
}: Readonly<ManageApplicantsProps>) => {
  const { filterState } = useFilterState();
  const { closeGig, isLoading } = useCloseGig();

  // Use applicants from job if not provided directly
  const jobApplicants = useMemo(() => {
    return applicants.length > 0 ? applicants : job?.applicants || [];
  }, [applicants, job?.applicants]);

  const paginatedApplicants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return jobApplicants.slice(startIndex, endIndex);
  }, [jobApplicants, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
      // Scroll to top of applicants list when page changes
      const applicantsContainer = document.querySelector(
        ".applicants-container"
      );
      if (applicantsContainer) {
        applicantsContainer.scrollTop = 0;
      }
    }
  };

  const handleItemsPerPageChange = (items: number) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(items);
      if (onPageChange) {
        onPageChange(1); // Reset to first page when changing items per page
      }
      // Scroll to top when items per page changes
      const applicantsContainer = document.querySelector(
        ".applicants-container"
      );
      if (applicantsContainer) {
        applicantsContainer.scrollTop = 0;
      }
    }
  };

  const handleCloseJob = async () => {
    await closeGig(String(job.id));
  }

  return (
    <Loading show={isLoading}>
      <div className="grid h-full w-full">
      {jobApplicants.length > 0 ? (
        <div className="w-full px-4 md:px-8 2xl:px-16 py-8">
          <div className="flex justify-between md:gap-x-8 lg:gap-x-16">
            <p className="text-[#F9F1E2] py-4 w-[90%] text-balance">
              {pageDetails}
            </p>
            <div className="flex items-center justify-end  w-[40%] ">
              <button onClick={handleCloseJob} className="bg-yellow text-[#1A1203] font-bold py-2 px-8 rounded uppercase text-sm hover:bg-yellow/90 transition-colors">
                Close Job
              </button>
            </div>
          </div>
          <div className="flex gap-x-8 w-full h-[calc(100vh-250px)]">
            {/* Mobile Filter */}
            {filterState && (
              <div className="md:hidden h-full">
                <Filter filters={filters} />
              </div>
            )}

            {/* Desktop Filter - Same height as content */}
            <div className="hidden md:flex md:w-[25%] h-full">
              <div className="w-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#FCFBF726] scrollbar-track-transparent">
                <Filter filters={filters} />
              </div>
            </div>

            {/* Main Content - Same height as filter */}
            <div className="flex flex-col w-[90vw] md:w-[75%] h-full">
              {/* Applicants List - Scrollable Container */}
              <div className="applicants-container flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#FCFBF726] scrollbar-track-transparent pr-2">
                <div className="space-y-4">
                  {paginatedApplicants.map((applicant) => (
                    <ApplicantCard
                      key={applicant.id || applicant.walletAddress}
                      applicant={applicant}
                      job={job}
                    />
                  ))}
                </div>
              </div>

              {/* Pagination - Fixed at bottom */}
              <div className="flex-shrink-0 pt-4 border-t border-[#FCFBF726]/20 mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={
                    totalPages || Math.ceil(jobApplicants.length / itemsPerPage)
                  }
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems || jobApplicants.length}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  itemType={jobType}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoJob
          title={title}
          desc={desc}
          imageSrc={imageSrc}
          jobType={jobType}
        />
      )}
    </div>
    </Loading>
  );
};

export default ManageApplicants;
