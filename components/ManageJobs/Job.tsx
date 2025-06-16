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
    <div className="h-full w-full">
      {jobs && jobs.length > 0 ? (
        <div className="p-4 flex flex-col w-full h-full">
          {/* Page Details - BEFORE sidebar and container */}
          <div className="w-full mb-4">
            <p className="text-[#F9F1E2] text-sm">
              {pageDetails}
            </p>
          </div>
          
          {/* Main Content: Sidebar + Jobs */}
          <div className="gap-x-8 md:flex w-full flex-1">
            {filterState && (
              <div className="md:hidden min-h-[60%]">
                <ActiveJobSidebar filters={filters} />
              </div>
            )}
            <div className="hidden md:grid md:w-[25%] xl:w-[20%] min-h-[60%]">
              <ActiveJobSidebar filters={filters} />
            </div>
            
            <div className="flex flex-col gap-y-2 w-[90vw] md:flex-1 h-full">
              {/* Scrollable Jobs Container - Wrapped in obvious div */}
              <div className="w-full flex-1">
                <div 
                  className="rounded-lg border border-[#FCFBF726] p-4"
                  style={{ backgroundColor: '#F2E8CF0A', height: '60vh' }}
                >
                  <div 
                    className="overflow-y-auto space-y-4 w-full job-container" 
                    style={{ height: 'calc(60vh - 2rem)' }}
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
                        height: 40px;
                      }
                      
                      .job-container::-webkit-scrollbar-thumb:hover {
                        background: #9ca3af;
                      }
                    `}</style>
                    
                    {/* Each job card wrapped in its own div */}
                    {jobs?.map((job, index) => (
                      <div key={`${job?.job?.title}-${index}`}>
                        <JobStatus job={job} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Pagination - Outside scroll area */}
              <div className="w-full">
                <Pagination />
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
  );
};

export default ManageJobs;