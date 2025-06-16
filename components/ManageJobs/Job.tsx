"use client";
import Filter from "./ActiveJobSidebar";
import { useFilterState } from "@/context/filter";
import { Applied } from "@/utils/job";
import { FilterProps } from "@/utils/filters";
import NoJob from "./NoJob";
import Pagination from "@/components/Marketplace/Pagnation"; // Import the pagination component
import ActiveJobSidebar from "./ActiveJobSidebar";

interface ManageJobProps {
  jobs: Applied[];
  title: string;
  desc: string;
  imageSrc: string;
  filters: FilterProps[];
  JobStatus: React.ComponentType<{ job: Applied }>;
  jobType: string;
  pageDetails?: string;
}

const ManageJobs = ({
  jobs = [],
  title,
  desc,
  imageSrc,
  filters,
  JobStatus,
  jobType,
  pageDetails,
}: Readonly<ManageJobProps>) => {
  const { filterState } = useFilterState();
  
  return (
    <div className="h-screen w-full overflow-hidden">
      {jobs && jobs.length > 0 ? (
        <div className="flex flex-col h-full">
          {/* Page Details */}
          {pageDetails && (
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
              <p className="text-[#F9F1E2] text-sm">
                {pageDetails}
              </p>
            </div>
          )}
          
          {/* Main Content Container - Side by side layout */}
          <div className="flex flex-1 gap-4 px-4 pb-4 min-h-0">
            {/* Sidebar - 25% width, full height */}
            <div className="w-1/4 flex-shrink-0 h-full">
              <ActiveJobSidebar filters={filters} />
            </div>
            
            {/* Jobs and Pagination Section - 75% width */}
            <div className="w-3/4 flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
              {/* Jobs Container - Takes most of the height */}
              <div className="flex-1 min-h-0">
                <div 
                  className="h-full rounded-lg border border-[#FCFBF726] overflow-hidden"
                  style={{ backgroundColor: '#F2E8CF0A' }}
                >
                  {jobType === "disputed" ? (
                    // Horizontal slider for disputed jobs
                    <div className="h-full p-4">
                      <div 
                        className="h-full overflow-x-auto flex gap-4 disputed-slider"
                        style={{ 
                          scrollbarWidth: 'thin', 
                          scrollbarColor: '#6b7280 transparent'
                        }}
                      >
                        <style jsx>{`
                          .disputed-slider::-webkit-scrollbar {
                            height: 6px;
                          }
                          
                          .disputed-slider::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          
                          .disputed-slider::-webkit-scrollbar-thumb {
                            background: #6b7280;
                            border-radius: 10px;
                          }
                          
                          .disputed-slider::-webkit-scrollbar-thumb:hover {
                            background: #9ca3af;
                          }
                        `}</style>
                        
                        {jobs?.map((job, index) => (
                          <div key={`${job?.job?.title}-${index}`} className="flex-shrink-0">
                            <JobStatus job={job} />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Vertical scroll for other job types
                    <div className="h-full p-4">
                      <div 
                        className="h-full overflow-y-auto space-y-4 job-container"
                      >
                        <style jsx>{`
                          .job-container {
                            scrollbar-width: thin;
                            scrollbar-color: #6b7280 transparent;
                          }
                          
                          .job-container::-webkit-scrollbar {
                            width: 6px;
                          }
                          
                          .job-container::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          
                          .job-container::-webkit-scrollbar-thumb {
                            background: #6b7280;
                            border-radius: 10px;
                          }
                          
                          .job-container::-webkit-scrollbar-thumb:hover {
                            background: #9ca3af;
                          }
                        `}</style>
                        
                        {jobs?.map((job, index) => (
                          <div key={`${job?.job?.title}-${index}`}>
                            <JobStatus job={job} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Pagination - Fixed at bottom */}
              <div className="flex-shrink-0 mt-4">
                <Pagination />
              </div>
            </div>
          </div>
          
          {/* Mobile Filter Toggle - Only show on mobile */}
          <div className="md:hidden px-4 pb-2">
            {filterState && (
              <div className="mb-4">
                <ActiveJobSidebar filters={filters} />
              </div>
            )}
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