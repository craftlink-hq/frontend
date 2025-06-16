"use client";

import type React from "react";

import Filter from "@/components/Marketplace/Filter";
import { useFilterState } from "@/context/filter";
import type { Applied, CompletedProps } from "@/utils/job";
import type { FilterProps } from "@/utils/filters";
import NoJob from "./NoJob";
import Pagination from "./JobsPagination";
import { useState } from "react";

interface ManageJobProps {
  jobs: Applied[];
  title: string;
  desc: string;
  imageSrc: string;
  filters: FilterProps[];
  JobStatus: React.ComponentType<{
    job: Applied | CompletedProps;
    key: string;
  }>;
  jobType: string;
  pageDetails?: string;
}

const ManageJobs = ({
  jobs,
  title,
  desc,
  imageSrc,
  filters,
  JobStatus,
  jobType,
  pageDetails,
}: Readonly<ManageJobProps>) => {
  const { filterState } = useFilterState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  return (
    <div className="grid h-full w-full">
      {jobs.length > 1 ? (
        <div className="w-full px-4 md:px-8 2xl:px-16 py-8">
          <p className="text-[#F9F1E2] py-4 w-[90%]">{pageDetails}</p>
          <div className="gap-x-8 md:flex w-full">
            {filterState && (
              <div className="md:hidden min-h-[60%]">
                <Filter filters={filters} />
              </div>
            )}
            <div className="hidden md:grid md:w-[25%] min-h-[60%]">
              <Filter filters={filters} />
            </div>
            <div className="grid gap-y-4 w-[90vw] md:w-[75%] h-full">
              {/* Jobs List */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobStatus job={job} key={job?.job?.title} />
                ))}
              </div>

              {/* Pagination */}
              {
                <div className="">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages} // Calculate based on total items
                    itemsPerPage={itemsPerPage}
                    totalItems={jobs.length} // This should come from your actual data
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={(items) => {
                      setItemsPerPage(items);
                      setCurrentPage(1); // Reset to first page when changing items per page
                    }}
                    itemType={`${jobType} Jobs`}
                  />
                </div>
              }
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
  );
};

export default ManageJobs;
