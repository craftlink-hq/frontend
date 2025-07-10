"use client"

import { appliedJobFilters } from "@/utils/filters"
import ManageApplicants from "@/components/ManageJobs/ManageApplicants"
import MarketHeader from "@/components/Marketplace/MarketHeader"
import { useFilterState } from "@/context/filter"
import { usePathname, useParams, useRouter } from "next/navigation"
import { useFetchClientPostedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientPostedGigs"
import { useState } from "react"

export default function JobApplicants() {
  const { filterState, setFilterState } = useFilterState()
  const pathname = usePathname()
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string

  const { postedGigs: Applications, isLoading, error } = useFetchClientPostedGigs()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  const isActive = (path: string) => pathname === path

  const toggleFilter = () => {
    setFilterState(!filterState)
  }

  const handleBackToJobs = () => {
    router.push("/manage-jobs/open")
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#333333]">
        <div className="text-[#F9F1E2]">Loading job applicants...</div>
      </div>
    )
  }

  // Handle fetch errors
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#333333]">
        <div className="text-red-400">Error loading job applicants: {error}</div>
      </div>
    )
  }

  // Handle empty data
  if (!Applications || Applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#333333]">
        <div className="text-[#F9F1E2]">No posted gigs found.</div>
      </div>
    )
  }

  // Find the specific job by ID
  const currentJob = Applications.find((job) => job.job.id === jobId)

  if (!currentJob) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#333333]">
        <div className="text-red-400">Job not found with ID: {jobId}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-[url('/bg.png')] min-h-screen bg-opacity-[25%]">
      <div className="flex flex-col bg-[#333333] bg-opacity-[95%] min-h-screen">
        <div className="min-h-screen">
          <div className="flex gap-y-4 flex-col w-screen h-full pb-8">
            <MarketHeader isActive={isActive} toggleFilter={toggleFilter} />

            <div className="w-[90%] self-center flex justify-between">
              <div className="self-center">
                <button
                  onClick={handleBackToJobs}
                  className="px-3 py-2 text-[#FCF8E3] font-merriweather bg-[#262208] hover:bg-[#262208]/80 transition-colors rounded"
                >
                  BACK TO OPEN JOBS
                </button>
              </div>
              <div className="self-center">
                <h1 className="text-[#F9F1E2] font-bold text-lg">Applicants for: {currentJob.job.title}</h1>
              </div>
            </div>

            <div className="w-[90%] self-center bg-[#F2E8CF0A] h-[70%] rounded-lg">
              <ManageApplicants
                job={currentJob.job}
                filters={appliedJobFilters}
                jobType="applicants"
                pageDetails={`Review and manage applications for "${currentJob.job.title}". You can hire artisans directly or start a conversation to learn more about their experience.`}
                currentPage={currentPage}
                totalPages={Math.ceil((currentJob.job?.applicants?.length || 0) / itemsPerPage)}
                itemsPerPage={itemsPerPage}
                totalItems={currentJob.job?.applicants?.length || 0}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
