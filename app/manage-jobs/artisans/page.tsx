"use client";
import { appliedJobFilters } from "@/utils/filters";
import AppliedJob from "@/components/ManageJobs/Applied";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchArtisanAppliedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanAppliedGigs";
import Loading from "@/components/Loading";

export default function AppliedJobs() {
  const { appliedGigs, isLoading, error } = useFetchArtisanAppliedGigs();

  if (error) {
    console.error("Error fetching applied gigs:", error);
    return (
      <div className="text-red-500">
        Error fetching applied jobs. Please try again later.
      </div>
    );
  }
  
  return (
    <Loading show={isLoading}>
      <div>
        <ManageJobs
          title={"You haven't applied for any job yets"}
          desc={
            "Browse available jobs and start applying to secure your next gig."
          }
          imageSrc={"/applied.png"}
          filters={appliedJobFilters}
          jobs={appliedGigs}
          JobStatus={AppliedJob}
          jobType={"applied"}
          pageDetails={"Keep track of the jobs you’ve applied for. Monitor responses and follow up on your applications with ease."}
        />
      </div>
    </Loading>
  );
}