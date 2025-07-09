"use client";
import { appliedJobFilters } from "@/utils/filters";
import ActiveJob from "@/components/ManageJobs/Active";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientActiveGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientActiveGigs";
import Loading from "@/components/Loading";

export default function ActiveJobs() {
  const { activeGigs: Actives, isLoading } = useFetchClientActiveGigs();

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"You have no active jobs at the moment"}
          desc={"Once a client hires you, your jobs will appear here. Keep an eye on your applications!"}
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
