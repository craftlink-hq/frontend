"use client";
import { appliedJobFilters } from "@/utils/filters";
import CompletedJob from "@/components/ManageJobs/Completed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchArtisanCompletedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanCompletedGigs";

export default function CompletedJobs() {
  const { completedGigs: Completed } = useFetchArtisanCompletedGigs();

  return (
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
  );
}
