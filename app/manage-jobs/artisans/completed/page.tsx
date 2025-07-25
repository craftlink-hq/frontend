"use client";
import { appliedJobFilters } from "@/utils/filters";
import CompletedJob from "@/components/ManageJobs/Completed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchArtisanCompletedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanCompletedGigs";
import Loading from "@/components/Loading";
import { useAccount } from "@/lib/thirdweb-hooks";

export default function CompletedJobs() {
  const { address } = useAccount();
  const { completedGigs: Completed, isLoading, error } = useFetchArtisanCompletedGigs(address);

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
          title={"You have no completed jobs yet."}
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
