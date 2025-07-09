"use client";
import { appliedJobFilters } from "@/utils/filters";
// import { Applications } from "@/utils/job";
import AppliedJob from "@/components/ManageJobs/Applied";
import ManageJobs from "@/components/ManageJobs/Job";
import { useFetchArtisanAppliedGigs } from "@/hooks/ManageJob/ArtisanHooks/useFetchArtisanAppliedGigs";

export default function AppliedJobs() {
  const { appliedGigs } = useFetchArtisanAppliedGigs();
  
  return (
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
  );
}

// const AppliedJobsList = () => {
//   const { appliedGigs, isLoading, error } = useFetchArtisanAppliedGigs();
//   console.log("Applied Jobs:", appliedGigs);

//   if (isLoading) {
//     return <div className="text-white">Loading applied jobs...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">Error: {error}</div>;
//   }

//   if (appliedGigs.length === 0) {
//     return <div className="text-white">No applied jobs found.</div>;
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       {appliedGigs.map((job, index) => (
//         <AppliedJob key={job.job._id || index} job={job} />
//       ))}
//     </div>
//   );
// };

// export default AppliedJobsList;