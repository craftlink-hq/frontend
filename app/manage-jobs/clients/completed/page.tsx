"use client";
import { appliedJobFilters } from "@/utils/filters";
import CompletedJob from "@/components/ManageJobs/Completed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchClientCompletedGigs } from "@/hooks/ManageJob/ClientHooks/useFetchClientCompletedGigs";
import Loading from "@/components/Loading";

export default function CompletedJobs() {
  const { completedGigs: Completed, isLoading, error } = useFetchClientCompletedGigs();

  if (error) {
    console.error("Error fetching completed gigs:", error);
    return (
      <div className="text-red-500">
        Error fetching completed jobs. Please try again later.
      </div>
    );
  }

  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"You haven’t hired anyone yet"}
          desc={
            "Post your first job to find the right artisan and kickstart your project."
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
