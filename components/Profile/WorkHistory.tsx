import { useState } from "react";
import { formatDate } from "@/utils/formatDate";
import { Applied } from '@/utils/types';
import { IoCloseSharp } from "react-icons/io5";

const Works = ({ works }: { works?: Applied[] }) => {
  const [selectedWork, setSelectedWork] = useState<Applied | null>(null);

  return (
    <div className="flex font-merriweather text-[#F9F1E2] p-4 md:p-8 bg-profile border border-[#FCFBF726] rounded-lg h-full gap-y-8 max-w-full flex-col">
      <h3 className="text-2xl font-bold">Work History</h3>
      <div className="min-w-screen flex overflow-x-scroll gap-x-4">
        {(!works || works.length === 0) ? (
          <div className="text-center text-[#D8D6CF] py-8 text-lg font-semibold col-span-full">
            No jobs yet!
          </div>
        ) : (
          works.map((work) => (
            <div
              key={work.job._id}
              className="bg-[#F2E8CF0A] border border-[#FCFBF726] rounded-lg p-6 flex flex-col w-full md:w-[35%]  gap-2 shadow cursor-pointer hover:border-yellow-400 transition"
              onClick={() => setSelectedWork(work)}
            >
              <span className="font-bold text-xl">
                {work.job.title}
              </span>
              <span className="text-[#B5B4AD] text-sm mb-2">
                {formatDate(work.job.createdAt)} &mdash; {work.job.projectDuration?.weeks} weeks
              </span>
              <div className="border-l-[3px] border-[#FCFBF726] px-4 text-[#B5B4AD] w-full line-clamp-3">
                {work.job.projectDescription || "No description provided."}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Popup Modal */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 h-[100vh] bg-[#F2E8CF0A] w-screen bg-opacity-90 backdrop-blur-sm flex items-center justify-center ">
          <div className="relative bg-profile   rounded-lg p-8 md:min-w-[35%] md:max-w-[60%] md:min-h-[40%] border border-[#FCFBF726] flex ">
            <div className="flex flex-col">
              <span className="text-lg font-alata text-[#F9F1E2] mb-2">{selectedWork.job.title}</span>
              <span className="text-[#B5B4AD]">{selectedWork.job.projectDescription}</span>
            </div>
            <button
              className="absolute top-0 right-1 rounded"
              onClick={() => setSelectedWork(null)}
            >
              <IoCloseSharp size={20} />

            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;