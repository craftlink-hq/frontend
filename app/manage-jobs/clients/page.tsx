"use client";
import { filters } from "@/utils/filters";
import OpenJob from "@/components/ManageJobs/Open";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientPostedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientPostedGigs";
import Loading from "@/components/Loading";

export default function AppliedJobs() {
  const { postedGigs: Applications, isLoading, error } = useFetchClientPostedGigs();

  if (error) {
    console.error("Error fetching posted gigs:", error);
    return (
      <div className="text-red-500">
        Error fetching posted jobs. Please try again later.
      </div>
    );
  }

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"You haven’t posted any jobs yet."}
          desc={
            "Create a job post to find the right talent for your project."
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
    </Loading>
  );
}
