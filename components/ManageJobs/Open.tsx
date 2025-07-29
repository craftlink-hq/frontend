"use client"

import type { Applied } from "@/utils/types"
import AnimatedDiv from "@/components/AnimatedDiv"
import Image from "next/image"
import { formatRelativeTime } from "@/utils/timeUtils";
import useGetClientInfo from "@/hooks/ManageJob/useGetClientInfo"
import { useRouter } from "next/navigation"
import { useCloseGig } from "@/hooks/Gasless/useCloseGig"
import Loading from "../Loading"

const OpenJob = ({ job }: { job: Applied }) => {
  const applicants = job.job?.applicants
  const { clientData } = useGetClientInfo(job.job.client?.walletAddress || "")
  const { closeGig, isLoading } = useCloseGig()
  const router = useRouter()
 
  const handleCloseJob = () => {
    if (job.job.id) {
      closeGig(String(job.job.id))
    } else {
      console.error("Job ID is not available for closing the job.")
    }
  }

  const handleViewAllApplicants = () => {
    // Navigate to applicants page with the specific job ID
    router.push(`/manage-jobs/applicants/${job.job.id}`)
  }

  const handleViewProfile = (applicantAddress: string) => {
    // Navigate to specific applicant profile
    router.push(`/profile/artisans/client-view/${applicantAddress}`)
  }


  return (
    <Loading show={isLoading}>
      <AnimatedDiv
      initialX="100%"
      animateX={0}
      exitX={"-100%"}
      duration={1.0}
      className="border border-[#FCFBF726] w-[92%] md:w-full rounded-xl flex flex-col gap-y-2 font-merriweather overflow-hidden"
    >
      {/* Posted Date */}
      <div className="w-full bg-[#403F3E] p-3 md:p-4">
        <span className="text-xs md:text-sm bg-[#00F7FF17] text-[#47F9FF] italic rounded-md p-2 md:p-[10px]">
          Posted: {formatRelativeTime(job.job?.createdAt) || "Two weeks ago"}
        </span>
      </div>

      <div className="p-3 md:p-4 space-y-3 md:space-y-4 flex flex-col md:flex-row md:justify-between w-full">
        {/* Job Title */}
        <div className="space-y-2 md:space-y-[4px] flex-1">
          <h2 className="text-[#F9F1E2] font-alata text-lg md:text-2xl font-bold leading-tight">{job.job?.title}</h2>

          {/* Job Details */}
          <div className="flex flex-wrap items-center text-xs md:text-sm text-[#B5B4AD] mb-2 gap-2 md:gap-0">
            <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2 border-r border-[#FCFBF726]">
              <Image src={"/location.svg"} alt={"location"} width="14" height="14" className="md:w-[18px] md:h-[16px]" />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">{clientData?.location}</span>
            </div>
            <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2 border-r border-[#FCFBF726]">
              <Image src={"/language.svg"} alt={"language"} width="12" height="14" className="md:w-[14px] md:h-[16px]" />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">{clientData?.language || "English"}</span>
            </div>
            <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2 border-r border-[#FCFBF726]">
              <Image src={"/calendar.svg"} alt={"timeline"} width="14" height="14" className="md:w-[18px] md:h-[16px]" />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">{job.job.projectDuration.weeks} weeks</span>
            </div>
            <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2">
              <Image src={"/expertise.svg"} alt={job.job.experienceLevel} width="16" height="14" className="md:w-[20px] md:h-[16px]" />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">{job.job.experienceLevel}</span>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="flex gap-x-2 items-center text-[#FFCC6D] mt-2 md:mt-0">
          <div className="flex">
            <Image src="/money-2.png" alt="Amount" width="16" height="16" className="md:w-[18px] md:h-[18px]" />
          </div>
          <span className="text-[#FFCC6D] text-xl md:text-2xl font-bold font-alata">
            ${job?.job?.price}
            <span className="text-xs md:text-sm font-normal text-[#FFCC6D]">(Fixed)</span>
          </span>
        </div>
      </div>

      {/* Applications Section */}
      {applicants && applicants.length > 0 ? (
        <>
          {/* Featured Applicant (Most Recent or Top Rated) */}
          <div className="bg-blurBg backdrop-blur-[200px] rounded-lg p-4 md:p-6 mx-2 md:mx-0">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-4 md:mb-6 w-full h-full">
              {/* Profile Image */}
              <div className="relative h-20 w-20 md:h-32 md:w-32 flex-shrink-0 mx-auto md:mx-0">
                <Image
                  src={applicants[0].avatar || "/about.png"}
                  alt={applicants[0].username || "Applicant"}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                  <h3 className="text-lg md:text-2xl font-bold text-[#F9F1E2] uppercase">{applicants[0].username}</h3>
                  <button
                    onClick={() => handleViewProfile(applicants[0].walletAddress)}
                    className="text-yellow hover:text-yellow/80 transition-colors text-xs md:text-sm font-medium px-3 py-1 border border-yellow rounded"
                  >
                    View Profile
                  </button>
                </div>
                <h4 className="text-sm md:text-lg text-[#B5B4AD] mb-3 md:mb-4">{applicants[0].category || "Fashion Designer"}</h4>

                {/* Details */}
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 text-xs md:text-sm text-[#B5B4AD]">
                  <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2 border-r border-[#FCFBF726]">
                    <Image src={"/location.svg"} alt={"location"} width="14" height="14" className="md:w-[18px] md:h-[16px]" />
                    <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">{applicants[0].location}</span>
                  </div>
                  <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2 border-r border-[#FCFBF726]">
                    <Image src={"/language.svg"} alt={"language"} width="12" height="14" className="md:w-[14px] md:h-[16px]" />
                    <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">
                      {applicants[0].preferredLanguages || "English"}
                    </span>
                  </div>
                  <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2 border-r border-[#FCFBF726]">
                    <Image src={"/expertise.svg"} alt={"expertise"} width="16" height="14" className="md:w-[20px] md:h-[16px]" />
                    <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">{applicants[0].experienceLevel}</span>
                  </div>
                  <div className="flex justify-center items-center gap-x-1 md:gap-x-2 px-1 md:px-2">
                    <Image src={"/calendar.svg"} alt={"timeline"} width="14" height="14" className="md:w-[18px] md:h-[16px]" />
                    <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">
                      <span>Available to work</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Summary */}
          <div className="bg-[#333333] border border-[#F2E8CF0A] rounded-lg p-3 md:p-4 mx-2 md:mx-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div>
                <h4 className="text-base md:text-lg font-medium text-[#F9F1E2] mb-1">{applicants.length} Applications Received</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <p className="text-[#B5B4AD] text-xs md:text-sm">Under Review: You have applications to review</p>
                </div>
              </div>
              <button
                onClick={handleViewAllApplicants}
                className="bg-yellow text-[#1A1203] font-bold py-2 md:py-2 px-4 md:px-4 rounded uppercase text-xs md:text-sm hover:bg-yellow/90 transition-colors w-full md:w-auto"
              >
                View All Applicants
              </button>
            </div>
          </div>
        </>
      ) : (
        /* No Applications State */
        <div className="bg-[#333333] rounded-lg p-6 md:p-8 mx-2 md:mx-0">
          <div className="text-center">
            <div className="mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-[#F9F1E2] mb-2 border-b-2 border-yellow pb-2 inline-block">
                No Applications Yet
              </h3>
            </div>
            <div className="space-y-3 md:space-y-4 text-[#B5B4AD] mb-4 md:mb-6">
              <p className="text-sm md:text-base leading-relaxed">
                No artisan has applied for this job yet. Closing the job will remove it from the marketplace, and
                artisans will no longer see it.
              </p>
              <p className="font-medium text-sm md:text-base">Do you want to close this job?</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCloseJob}
                className="bg-yellow text-[#1A1203] font-bold py-3 px-4 md:px-6 rounded uppercase text-xs md:text-sm hover:bg-yellow/90 transition-colors"
              >
                Yes, Close Job
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedDiv>
    </Loading>
  )
}

export default OpenJob