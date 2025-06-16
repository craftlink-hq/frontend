"use client";
import { disputedJobFilters } from "@/utils/filters";
import {Jobs } from "@/utils/job";
import DisputedJobCard from "@/components/ManageJobs/Disputed";
import ManageJobs from "@/components/ManageJobs/Job";

export default function DisputedJobs() {
  return (
    <div>
      <ManageJobs
        title={"You have no disputed jobs currently."}
        desc={"All your jobs are going smoothly! If an issue arises, it will appear here for resolution."}
        imageSrc={"/disputed.png"}
        filters={disputedJobFilters}
        jobs={Jobs}
        JobStatus={DisputedJobCard}
        jobType={"disputed"}
        pageDetails={"View and manage jobs currently under dispute. Respond to claims, upload evidence, or track resolution updates."}
      />
    </div>
  );
}