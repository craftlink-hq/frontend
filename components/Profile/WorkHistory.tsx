import { formatDate } from "@/utils/formatDate";
import { Applied } from '@/utils/types';

const Works = ({ works }: { works?: Applied[] }) => {
  return (
    <div className="flex font-merriweather text-[#F9F1E2] p-4 md:p-8 bg-profile border border-[#FCFBF726] rounded-lg h-full gap-y-8 max-w-full  flex-col">
      <h3 className="text-2xl font-bold">Work History</h3>
      <div className="flex flex-col gap-8 px-4">
      {works?.length === 0 ? (
        <div className="text-center text-[#D8D6CF] py-8 text-lg font-semibold">
          No jobs yet!
        </div>
      ) : (works?.map((work) => (
          <div key={work.job._id} className="flex gap-x-4">
            <p className="h-4 w-4 p-2 rounded-full bg-[#AEFF00]"></p>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xl">
                {work.job.title} 
                <p>{formatDate(work.job.createdAt)} - {work.job.projectDuration?.weeks} weeks</p>
              </span>
              <div className="border-l-[3px] border-[#FCFBF726] px-4 text-[#B5B4AD] w-full line-clamp-3  ">
                {work.job.projectDescription || "No description provided."}
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};

export default Works;
