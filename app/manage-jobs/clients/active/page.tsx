"use client";
import { appliedJobFilters } from "@/utils/filters";
import ActiveJob from "@/components/ManageJobs/Active";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientActiveGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientActiveGigs";
import Loading from "@/components/Loading";

export default function ActiveJobs() {
  const { activeGigs: Actives, isLoading, error } = useFetchClientActiveGigs();

  if (error) {
    console.error("Error fetching active gigs:", error);
    return (
      <div className="text-red-500">
        Error fetching active jobs. Please try again later.
      </div>
    );
  }

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"You have no active jobs at the moment"}
          desc={""}
          imageSrc={"/active.png"}
          filters={appliedJobFilters}
          jobs={Actives}
          JobStatus={ActiveJob}
          jobType={"active"}
          pageDetails={"View the jobs you’re currently working on. Submit updates, chat with clients, and stay on top of deadlines."}
        />
      </div>
    </Loading>
  );
}
