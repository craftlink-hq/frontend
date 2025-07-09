"use client";
import { filters } from "@/utils/filters";
import OpenJob from "@/components/ManageJobs/Open";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientPostedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientPostedGigs";

export default function AppliedJobs() {
  const { postedGigs: Applications } = useFetchClientPostedGigs();

  return (
    <div>
      <ManageJobs
        title={"You haven't applied for any job yets"}
        desc={
          "Browse available jobs and start applying to secure your next gig."
        }
        imageSrc={"/applied.png"}
        filters={filters}
        jobs={Applications}
        JobStatus={OpenJob}
        jobType={"open"}
        pageDetails={
          "Here are the jobs you’ve posted and are currently receiving artisan applications. Manage them by reviewing artisan profiles."
        }
      />
    </div>
  );
}
