"use client";
import { appliedJobFilters } from "@/utils/filters";
import ManageJobs from "@/components/ManageJobs/Job";
import DisputedJob from "@/components/ManageJobs/Disputed";
import { dispute } from "@/utils/job";

export default function DisputedJobs() {

  return (
      <div>
        <ManageJobs
          title={"You have no disputed jobs currently"}
          desc={"All your jobs are going smoothly! If an issue arises, it will appear here for resolution."}
          imageSrc={"/disputed.png"}
          filters={appliedJobFilters}
          jobs={dispute}
          JobStatus={DisputedJob}
          jobType={"disputed"}
          pageDetails={"Review jobs that are no longer open. Understand why they were closed and learn from past opportunities."}
        />
      </div>
  );
}
