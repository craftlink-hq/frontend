"use client";
import { appliedJobFilters } from "@/utils/filters";
import CompletedJob from "@/components/ManageJobs/Completed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientCompletedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientCompletedGigs";
import Loading from "@/components/Loading";

export default function CompletedJobs() {
  const { completedGigs: Completed, isLoading } = useFetchClientCompletedGigs();

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"You have no completed jobs at the moment"}
          desc={
            "Complete your first job to see it listed here and start building your reputation."
          }
          imageSrc={"/completed.png"}
          filters={appliedJobFilters}
          jobs={Completed}
          JobStatus={CompletedJob}
          jobType={"completed"}
          pageDetails={
            "Celebrate your handwork! View the jobs you’ve successfully completed and the feedback received from clients."
          }
        />
      </div>
    </Loading>
  );
}
