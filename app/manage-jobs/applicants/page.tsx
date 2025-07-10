"use client";
import { appliedJobFilters } from "@/utils/filters";
import ManageApplicants from "@/components/ManageJobs/ManageApplicants";
import MarketHeader from "@/components/Marketplace/MarketHeader";
import { useFilterState } from "@/context/filter";
import { usePathname } from "next/navigation";
import { useFetchClientPostedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientPostedGigs";

export default function CompletedJobs() {
  const { filterState, setFilterState } = useFilterState();
  const pathname = usePathname();
  const { postedGigs: Applications, isLoading, error } = useFetchClientPostedGigs();
  console.log("Applications", Applications);

  const isActive = (path: string) => pathname === path;
  const toggleFilter = () => {
    setFilterState(!filterState);
  };

  // Handle loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle fetch errors
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle empty data
  if (Applications.length === 0) {
    return <div>No posted gigs found.</div>;
  }

  // Use the first gig when data is available
  const firstGig = Applications[1];

  return (
    <div className="flex flex-col bg-[url('/bg.png')] min-h-screen bg-opacity-[25%]">
      <div className="flex flex-col bg-[#333333] bg-opacity-[95%] min-h-screen ">
        <div className="min-h-screen">
          <div className="flex gap-y-4 flex-col w-screen h-full pb-8">
            <MarketHeader isActive={isActive} toggleFilter={toggleFilter} />
            <div className="w-[90%] self-center flex justify-between">
              <div className="self-center">
                <button className="px-3 py-2 text-[#FCF8E3] font-merriweather bg-[#262208]">
                  BACK TO OPEN JOBS
                </button>
              </div>
            </div>
            <div className="w-[90%] self-center bg-[#F2E8CF0A] h-[70%] rounded-lg">
              <ManageApplicants
                filters={appliedJobFilters}
                job={firstGig}
                jobType={"applicants"} // Updated to reflect purpose
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}