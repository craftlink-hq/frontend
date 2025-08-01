import { formatDate } from "@/utils/formatDate";
import { Job } from "@/utils/types";
import Image from "next/image";

const CompletedProjects = ({ projects }: { projects: Job[] }) => {
  return (
    <div className="text-[#F9F1E2] font-merriweather bg-[#F2E8CF0A] p-2 md:p-8 rounded-xl gap-y-4 flex h-full flex-col">
      <div className="flex w-full justify-between py-4">
        <h3 className="text-xl font-bold px-2">Completed Projects</h3>
      </div>
        {projects.length === 0 ? (
        <div className="text-center text-[#D8D6CF] py-8 text-lg font-semibold">
          No completed jobs yet!
        </div>
      ) : (projects.map((project) => (
        <div
          key={formatDate(project.createdAt)}
          className="bg-profile max-sm:border-[0.5px] max-sm:border-[#FCFBF726] rounded-md p-4"
        >
          <div className="flex gap-8 w-full justify-between">
            <div className="flex flex-col ">
              <div className="flex flex-col  text-start py-4 gap-y-4">
                <div className="flex flex-col w-fit gap-x-[22px]">
                  <h3 className=" font-alata text2xl md:text-3xl font-bold">
                    {project.title}{" "}
                  </h3>
                  <div className=" py-2 font-merriweather w-full self-start flex flex-wrap  gap-4">
                    <div className={`flex gap-2`}>
                      <div className="flex gap-x-2 self-center relative h-[22px] w-[22px]">
                        <Image
                          src={"/money.svg"}
                          alt="amount"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="capitalize italic  self-center text-start text-[#F9F1E2]">
                        ${project.price}
                      </span>
                    </div>
                    <div className={`flex gap-2`}>
                      <div className="flex gap-x-2 self-center relative h-[22px] w-[22px]">
                        <Image
                          src={"/calendar.svg"}
                          alt={"timeline"}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="capitalize italic  self-center text-start text-[#F9F1E2]">
                        Completed within {project.projectDuration.weeks} weeks
                      </span>
                    </div>
                  </div>
                </div>
                <div className=" flex flex-wrap gap-2">
                  <span>Completed by:</span>
                  <span className="text-[#D8D6CF]">
                    {project.client?.walletAddress.slice(0, 6)}...
                    {project.client?.walletAddress.slice(-5)}
                  </span>{" "}
                </div>
                <div className="flex  text-sm items-center justify-start gap-x-2">
                  <p className=" text-[#D8D6CF]">
                    {project.completedBy?.review}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )))}
    </div>
  );
};

export default CompletedProjects;
