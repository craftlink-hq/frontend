"use client";
import { appliedJobFilters } from "@/utils/filters";
import ClosedJob from "@/components/ManageJobs/Closed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientClosedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientClosedGigs";
import Loading from "@/components/Loading";

export default function ClosedJobs() {
  const { closedGigs: Closed, isLoading } = useFetchClientClosedGigs();

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"No closed jobs at the moment."}
          desc={"Jobs that were closed without proceeding will show up here. Keep applying for more opportunities!"}
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
