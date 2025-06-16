import { Applied } from "@/utils/job";
import NoJob from "./NoJob";
import Image from "next/image";
import ActiveJobSidebar from "./ActiveJobSidebar";
import { FilterProps } from "@/utils/filters";
import Pagnation from "../Pagnation";

const filters: FilterProps[] = [
  { filter: "Status", options: ["Accepted", "In Progress", "Pending Start"] },
  { filter: "Location", options: ["Remote", "On-site", "Hybrid", "Local", "International"] },
  { filter: "Sort By", options: ["Date", "Price", "Relevance"] }
];


const DisputedJob = ({ job }: { job: Applied }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header section - full width */}
      <div className="font-merriweather text-[#F9F1E2] px-4 md:px-8 xl:px-16 py-8">
        <h2 className="font-bold text-lg">Resolve Outstanding Disputes</h2>
        <h4 className="text-sm text-[#F9F1E2]">
          View and manage jobs currently under dispute. Respond to claims,
          upload evidence, or track resolution updates.
        </h4>
      </div>

      {/* Main content area with sidebar and content */}
      <div className="flex flex-1">
        {job ? (
          <>
            {/* Sidebar - 25% width */}
            <div className="w-1/4 h-full">
              <ActiveJobSidebar />
            </div>
            
            {/* Main content - 75% width */}
            <div className="w-3/4 h-full overflow-y-auto">
              {/* Scrollable container for disputed jobs */}
              <div className="h-full overflow-y-auto px-4 md:px-8 xl:px-16 py-8">
                <div className="space-y-6">
                  {/* Disputed Job Card */}
                  <div className="font-merriweather text-[#F9F1E2]">
                    {/* Main dispute card */}
                    <div className="bg-[#2A2A2A] rounded-lg p-6 relative">
                      {/* Posted time - top left */}
                      <div className="text-cyan-400 text-sm mb-4">
                        Posted: Two weeks ago
                      </div>
                      
                      {/* Dispute raised by section */}
                      <div className="mb-4">
                        <div className="text-[#B5B4AD] text-sm mb-1">
                          Dispute raised by: Artisan
                        </div>
                        <div className="text-[#F9F1E2] font-alata text-lg">
                          {job.job?.client?.walletAddress.slice(0, 4)}...{job.job?.client?.walletAddress.slice(-4)}
                        </div>
                      </div>
                      
                      {/* Job title */}
                      <h3 className="text-[#F9F1E2] text-xl font-bold mb-4">
                        {job?.job?.title}
                      </h3>
                      
                      {/* Job details row */}
                      <div className="flex items-center gap-4 text-sm text-[#B5B4AD] mb-6">
                        <div className="flex items-center gap-1">
                          <span>📍</span>
                          <span>Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🌐</span>
                          <span>English</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>3 Weeks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📊</span>
                          <span>Intermediate</span>
                        </div>
                      </div>
                      
                      {/* Dispute details grid */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <div className="text-[#B5B4AD] text-sm mb-1">Raised Date:</div>
                          <div className="text-[#F9F1E2] font-medium">13/3/24</div>
                        </div>
                        <div>
                          <div className="text-[#B5B4AD] text-sm mb-1">Dispute Type:</div>
                          <div className="text-[#F9F1E2] font-medium">{job?.disputeType || "Payment not released"}</div>
                        </div>
                        <div>
                          <div className="text-[#B5B4AD] text-sm mb-1">Budget:</div>
                          <div className="text-[#F9F1E2] font-medium flex items-center gap-1">
                            <span>💰</span>
                            ${job?.job?.price}/month
                          </div>
                        </div>
                        <div>
                          <div className="text-[#B5B4AD] text-sm mb-1">Resolution Status:</div>
                          <div className="text-orange-400 font-medium">
                            🟡 Pending: Awaiting Client Action
                          </div>
                        </div>
                      </div>
                      
                      {/* View full details button */}
                      <div className="flex justify-end">
                        <button className="bg-[#4A4A3A] hover:bg-[#5A5A4A] text-[#F9F1E2] px-6 py-2 rounded text-sm font-medium transition-colors">
                          VIEW FULL DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Sidebar - 25% width */}
            <div className="w-1/4 h-full">
              <ActiveJobSidebar />
            </div>
            
            {/* Main content - 75% width */}
            <div className="w-3/4 h-full overflow-y-auto">
              <div className="h-full overflow-y-auto px-4 md:px-8 xl:px-16 py-8">
                <NoJob
                  title={"You have no disputed jobs currently."}
                  desc={
                    "All your jobs are going smoothly! If an issue arises, it will appear here for resolution."
                  }
                  imageSrc={"/disputed.png"}
                  jobType={"disputed"}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DisputedJob;