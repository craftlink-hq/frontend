"use client";

import type { Applied } from "@/utils/types";
import { percentage } from "@/utils/job";
import useGetPlatformFee from "@/hooks/PaymentProcessor/useGetPlatformFee";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useState } from "react";
import Feedback from "./Feedback";
import Modal from "../Modal";
import Image from "next/image";
import ClaimPaymentModal from "./ClaimPaymentModal";
import PaymentSuccessModal from "./PaymentSuccess";
import { formatRelativeTime } from "@/utils/timeUtils";
import useGetClientInfo from "@/hooks/ManageJob/useGetClientInfo";
import { useReleaseArtisanFunds } from "@/hooks/Gasless/useReleaseArtisanFunds";
import useGetPaymentDetails from "@/hooks/PaymentProcessor/useGetPaymentDetails";
import useGetGigInfo from "@/hooks/GigMarketplace/useGetGigInfo";
import { useRouter } from "next/navigation";
import { useGetUserRole } from "@/utils/store";
import { useAccount } from "@/lib/thirdweb-hooks";
import useGetReviewDetails from "@/hooks/ReviewSystem/useGetReviewDetails";
import { toast } from "sonner";

const CompletedJob = ({ job }: { job: Applied }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const { clientData } = useGetClientInfo(job.job.client?.walletAddress || "");
  const { releaseArtisanFunds } = useReleaseArtisanFunds();
  const gigInfo = useGetGigInfo(String(job?.job?.id));
  const paymentId = gigInfo && !isNaN(Number(gigInfo.paymentId)) ? Number(gigInfo.paymentId) : 0;
  const paymentDetails = useGetPaymentDetails(paymentId);
  const router = useRouter();
  const { role } = useGetUserRole();
  const { address } = useAccount();
  const isClaimed = paymentDetails?.isReleased || false;
  const platformFee = useGetPlatformFee();

  const reviewee = role === "client" ? job.job.completedBy?.walletAddress || "" : job.job.client?.walletAddress || "";
  const review = useGetReviewDetails(address || "", reviewee, job.job.id as string);

  const onClaim = async () => {
    const databaseId = job.job.id;
    if (!databaseId) {
      console.error("Gig ID is not available");
      return;
    }

    const success = await releaseArtisanFunds(String(databaseId));
    if (success) {
      setIsClaimModalOpen(false);
      setIsSuccessOpen(true);
    } else {
      console.error("Failed to release artisan funds");
      return;
    }
  };

  const handleViewProfile = () => {
    let address;
    if (role === "artisan") {
      address = job?.job?.client?.walletAddress;
      router.push(`/profile/clients/artisan-view/${address}`);
    } else if (role === "client") {
      address = job.job.completedBy?.walletAddress;
      router.push(`/profile/artisans/client-view/${address}`);
    }
  };

  // Handle feedback button click with review check
  const handleFeedbackClick = () => {
    if (!address) {
      toast.error("Please connect your wallet to give feedback.");
      return;
    }
    if (review) {
      toast.info("You have already submitted feedback for this job.");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <AnimatedDiv
      initialX="100%"
      animateX={0}
      exitX={"-100%"}
      duration={1.0}
      className="group hover:bg-[#F2E8CF0A] border border-[#FCFBF726] w-[92%] md:w-full rounded-xl flex flex-col gap-y-3 md:gap-y-4 font-merriweather overflow-hidden"
    >
      {/* Posted Date */}
      <div className="w-full bg-[#403F3E] p-3 md:p-4">
        <span className="text-xs md:text-sm bg-[#00F7FF17] text-[#47F9FF] italic rounded-md p-2 md:p-[10px]">
          Posted: {formatRelativeTime(job.job?.createdAt)}
        </span>
      </div>

      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {/* Client Address */}
        <div className="mb-2 flex justify-between items-center">
          {job.user_type === "artisan" ? (
            <p className="text-[#D8D6CF] text-base md:text-[20px] font-merriweather">
              {job.job.client?.walletAddress.slice(0, 4)}...
              {job.job.client?.walletAddress.slice(-5)}
            </p>
          ) : (
            <p className="text-[#D8D6CF] text-base md:text-[20px] font-merriweather">
              {job.job.completedBy?.walletAddress.slice(0, 4)}...
              {job.job.completedBy?.walletAddress.slice(-5)}
            </p>
          )}
          <div className="flex flex-col">
            <button className="text-[#FFD700] text-sm md:text-base" onClick={() => handleViewProfile()}>
              View Profile
            </button>
            <p className="border-b border-yellow w-full"></p>
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-2 md:space-y-[4px]">
          <h2 className="text-[#F9F1E2] font-alata text-lg md:text-2xl font-bold leading-tight">
            {job.job?.title}
          </h2>

          {/* Job Details - Made Responsive */}
          <div className="flex flex-wrap items-center text-xs md:text-sm text-[#B5B4AD] mb-2 gap-1">
            <div className="flex justify-center items-center gap-x-1 px-1 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/location.svg"}
                alt="Location icon"
                width="10"
                height="10"
                className="md:w-[18px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">
                {clientData?.location}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-1 px-1 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/language.svg"}
                alt="language icon"
                width="14"
                height="14"
                className="md:w-[14px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">
                {clientData?.language}
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-1 px-1 md:px-2 border-r border-[#FCFBF726]">
              <Image
                src={"/calendar.svg"}
                alt="calender icon"
                width="10"
                height="10"
                className="md:w-[18px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">
                {job.job.projectDuration.weeks}w
              </span>
            </div>
            <div className="flex justify-center items-center gap-x-1 px-1 md:px-2">
              <Image
                src={"/expertise.svg"}
                alt="expertise icon"
                width="10"
                height="10"
                className="md:w-[20px] md:h-[16px]"
              />
              <span className="font-merriweather text-[#D8D6CF] text-xs md:text-sm">
                {job.job.experienceLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1 md:gap-0">
          <div className="flex gap-x-2 items-center text-[#FFCC6D]">
            <div className="flex">
              <Image
                src="/money-2.png"
                alt="Amount"
                width="16"
                height="16"
                className="md:w-[18px] md:h-[18px]"
              />
            </div>
            <span className="text-[#FFCC6D] text-xl md:text-2xl font-bold font-alata">
              ${job?.job?.price}
              <span className="text-xs md:text-sm font-normal text-[#FFCC6D] ml-1">(Fixed)</span>
            </span>
          </div>
          <span className="text-[#B5B4AD] text-xs md:text-sm ml-6 md:ml-0">
            ≈ ₦{job.job?.price ? (job.job.price * 1500).toLocaleString() : "2,250,000"}
          </span>
        </div>

        <div className="space-y-3 md:space-y-4">
          {/* Dates - Made to fit in one line */}
          <div className="flex items-center gap-x-2 text-xs md:text-sm flex-wrap">
            <div className="flex items-center gap-x-1">
              <span className="relative h-[14px] w-[14px] md:h-[20px] md:w-[20px]">
                <Image
                  src="/calendar.svg"
                  alt="Calendar"
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </span>
              <p className="font-merriweather text-[#B5B4AD] whitespace-nowrap">
                Start: {job?.startDate}
              </p>
            </div>
            <p className="border-b w-2 md:w-4 border-[#FCFBF726]"></p>
            <div className="flex items-center gap-x-1">
              <span className="relative h-[14px] w-[14px] md:h-[20px] md:w-[20px]">
                <Image
                  src="/endDate.png"
                  alt="End date"
                  fill
                  style={{ objectFit: "contain", objectPosition: "center" }}
                />
              </span>
              <p className="font-merriweather text-[#B5B4AD] whitespace-nowrap">
                End: {job?.endDate}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-[#F9F1E2] font-medium text-sm md:text-base">
              Completed: <span className="text-[#B5B4AD]">Payment Released</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        {job.user_type === "artisan" ? (
          <div className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-3">
            <button
              className={`text-[#262208] font-bold px-4 md:px-6 py-3 md:py-2 rounded uppercase text-sm md:text-sm transition-colors w-full md:w-auto md:flex-none
                ${isClaimed ? "border border-[#262208] text-[#F9F1E2] cursor-not-allowed" : "bg-yellow hover:bg-yellow/90"}
              `}
              onClick={() => setIsClaimModalOpen(true)}
              disabled={isClaimed}
            >
              {isClaimed ? "Claimed" : "Claim Payment"}
            </button>
            <button
              onClick={handleFeedbackClick}
              className="bg-[#262208] text-[#F9F1E2] font-bold px-4 md:px-6 py-3 md:py-2 rounded uppercase text-sm md:text-sm hover:bg-[#2A2A2A] transition-colors w-full md:w-auto md:flex-none"
            >
              Give Feedback
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={handleFeedbackClick}
              className="bg-[#262208] text-[#F9F1E2] font-bold px-4 md:px-6 py-2 rounded uppercase text-xs md:text-sm hover:bg-[#2A2A2A] transition-colors"
            >
              Give Feedback
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal closeFn={() => setIsModalOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] w-[90vw] md:w-[40vw] lg:w-[35vw] rounded-xl p-4 relative max-w-md md:max-w-none mx-auto"
          >
            <Feedback
              onCancel={() => setIsModalOpen(false)}
              databaseId={job.job.id as string}
            />
          </AnimatedDiv>
        </Modal>
      )}
      {isClaimModalOpen && (
        <Modal closeFn={() => setIsClaimModalOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] w-[90vw] md:w-[40vw] lg:w-[35vw] rounded-xl p-4 relative max-w-md md:max-w-none mx-auto"
          >
            <ClaimPaymentModal
              onClaim={onClaim}
              onCancel={() => setIsClaimModalOpen(false)}
              jobTitle={job.job.title}
              totalAmount={job.job.price ?? 404}
              feePercentage={platformFee ? Number(platformFee) : percentage}
              walletAddress={job.job.completedBy?.walletAddress || ""}
            />
          </AnimatedDiv>
        </Modal>
      )}
      {isSuccessOpen && (
        <Modal closeFn={() => setIsSuccessOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] w-[90vw] md:w-[40vw] lg:w-[35vw] rounded-xl p-4 relative max-w-md md:max-w-none mx-auto"
          >
            <PaymentSuccessModal
              onDone={() => setIsModalOpen(false)}
              onLeaveReview={() => ""}
              amount={job.job.price || 404}
              walletAddress={job.job.completedBy?.walletAddress || ""}
              closeFn={() => setIsSuccessOpen(false)}
            />
          </AnimatedDiv>
        </Modal>
      )}
    </AnimatedDiv>
  );
};

export default CompletedJob;