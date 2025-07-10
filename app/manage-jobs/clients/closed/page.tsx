"use client";
import { appliedJobFilters } from "@/utils/filters";
import ClosedJob from "@/components/ManageJobs/Closed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientClosedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientClosedGigs";
import Loading from "@/components/Loading";

export default function ClosedJobs() {
  const { closedGigs: Closed, isLoading, error } = useFetchClientClosedGigs();

  if (error) {
    console.error("Error fetching closed gigs:", error);
    return (
      <div className="text-red-500">
        Error fetching closed jobs. Please try again later.
      </div>
    );
  }

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"No closed jobs yet"}
          desc={"Jobs you ended or didn’t continue will show up here. Posting job and connect with skilled artisans."}
          imageSrc={"/closed.png"}
          filters={appliedJobFilters}
          jobs={Closed}
          JobStatus={ClosedJob}
          jobType={"closed"}
          pageDetails={"Review jobs that are no longer open. Understand why they were closed and learn from past opportunities."}
        />
      </div>
    </Loading>
  );
}
