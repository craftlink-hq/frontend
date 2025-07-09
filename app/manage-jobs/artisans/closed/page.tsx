"use client";
import { appliedJobFilters } from "@/utils/filters";
import ClosedJob from "@/components/ManageJobs/Closed";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchArtisanClosedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanClosedGigs";
import Loading from "@/components/Loading";

export default function ClosedJobs() {
  const { closedGigs: Closed, isLoading, error } = useFetchArtisanClosedGigs();

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
