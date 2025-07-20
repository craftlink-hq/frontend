"use client";
import { Job } from "@/utils/types"; // Change to use the flexible Job type
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import AttachedFiles from "./AttachedFiles";
import { useGetUserRole } from "@/utils/store";

const JobDetailsModal = ({ job, onApplyClick }: { job: Job; onApplyClick: () => void }) => {
  const { role } = useGetUserRole();

  const displayPrice = job.price ?? 0;
  const isArtisan = role === "artisan";
  
  // Safe access to potentially missing properties
  const jobFiles = job.files || [];
  const jobImages = job.images || [];
  const jobSkills = job.skillCategory || [];
  const jobClient = job.client || {
    walletAddress: "0x1234...5678",
    verificationStatus: false,
    about: "Professional client",
    dateJoined: "Recent",
  };
  const handleViewProfile = () => {
    if (isArtisan) {
      // Navigate to client profile page or trigger profile view
      console.log("Viewing client profile:", jobClient.walletAddress);
      // You can add navigation logic here, like:
      // router.push(`/client-profile/${jobClient.id}`) or similar
    }
  };
  

  return (
    <div className="text-start font-merriweather w-full flex items-start gap-y-6 flex-col">
      {/* Job Header */}
      <div className="w-full flex flex-col space-y-4">
        <div 
          className="w-fit px-3 py-1 rounded"
          style={{ backgroundColor: '#00F7FF17' }}
        >
          <span 
            className="text-xs font-medium italic sm:text-[10px]"
            style={{ color: '#47F9FF' }}
          >
            Posted: {job.createdAt}
          </span>
        </div>
        <h2 className="font-alata text-xl text-white leading-tight sm:text-lg md:text-3xl">
          {job.title}
        </h2>
        <div className="flex items-center gap-1 text-[8px] text-[#B5B4AD] md:gap-6 md:text-sm">
          <div className="flex items-center gap-[2px] md:gap-2">
            <FiMapPin className="w-2 h-2 md:w-4 md:h-4" />
            <span>{job.preferredLocation}</span>
          </div>
          <div className="flex items-center gap-[2px] md:gap-2">
            <Image
              src="/market/tabler_flag.svg"
              alt=""
              width={8}
              height={8}
              className="md:w-4 md:h-4"
            />
            <span>{job.language ?? "English"}</span>
          </div>
          <div className="flex items-center gap-[2px] md:gap-2">
            <Image
              src="/market/calendar-tick.svg"
              alt=""
              width={8}
              height={8}
              className="md:w-4 md:h-4"
            />
            <span>{`${job.projectDuration.weeks} Weeks`}</span>
          </div>
          <div className="flex items-center gap-[2px] md:gap-2">
            <Image
              src="/market/medal-star.svg"
              alt=""
              width={8}
              height={8}
              className="md:w-4 md:h-4"
            />
            <span>{job.experienceLevel}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        <p className="text-[#B5B4AD] text-xs font-medium tracking-wide mb-4 sm:text-[10px] md:text-sm">DETAILED DESCRIPTION</p>
        <p className="text-[#D8D6CF] leading-relaxed text-sm sm:text-xs md:text-base">
          {job.projectDescription}
        </p>
      </div>

      {/* Budget/Experience/Duration Cards - AFTER Description */}
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap">
          {/* Budget Card - Full width on mobile, flex-1 on desktop */}
          <div className="rounded-xl w-full md:flex-1 md:min-w-[200px] p-4 border border-[#FCFBF726]">
            <div className="flex gap-x-2 mb-4">
              <Image
                src="/market/money-2.svg"
                alt="Budget"
                width={20}
                height={20}
                className="sm:w-4 sm:h-4 md:w-6 md:h-6"
              />
              <span className="font-bold text-[#B5B4AD] text-sm sm:text-xs md:text-base">Budget</span>
            </div>
            <span className="text-[#F9F1E2] text-base font-medium sm:text-sm md:text-lg">
              ${displayPrice.toLocaleString()}
              <span className="text-[#B5B4AD] font-normal text-xs ml-1 sm:text-[10px] md:text-sm">
                ({job.paymentType})
              </span>
            </span>
          </div>

          {/* Experience and Duration Cards - Side by side on mobile */}
          <div className="flex gap-4 w-full md:contents">
            <div className="rounded-xl w-1/2 md:flex-1 md:min-w-[200px] p-4 border border-[#FCFBF726]">
              <div className="flex gap-x-2 mb-4">
                <Image
                  src="/market/medal-star.svg"
                  alt="Experience"
                  width={16}
                  height={16}
                  className="sm:w-4 sm:h-4 md:w-6 md:h-6"
                />
                <span className="font-bold text-[#B5B4AD] text-xs sm:text-[10px] md:text-base">Experience</span>
              </div>
              <span className="text-[#F9F1E2] text-sm sm:text-xs md:text-lg font-medium">
                {job.experienceLevel}
              </span>
            </div>

            <div className="rounded-xl w-1/2 md:flex-1 md:min-w-[200px] p-4 border border-[#FCFBF726]">
              <div className="flex gap-x-2 mb-4">
                <Image
                  src="/market/calendar-tick.svg"
                  alt="Duration"
                  width={16}
                  height={16}
                  className="sm:w-4 sm:h-4 md:w-6 md:h-6"
                />
                <span className="font-bold text-[#B5B4AD] text-xs sm:text-[10px] md:text-base">Duration</span>
              </div>
              <span className="text-[#F9F1E2] text-sm sm:text-xs md:text-lg font-medium">
                {job.projectDuration.weeks} Weeks
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Required Skills */}
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        <p className="text-[#B5B4AD] mb-4 text-xs sm:text-[10px] md:text-sm">REQUIRED SKILLS</p>
        <div className="flex flex-wrap gap-3">
          {jobSkills.map((tag, index) => (
            <span
              key={tag + index}
              className="bg-[#26220826] text-[#D8D6CF] border rounded-full border-[#FFFFFF40] text-xs px-4 py-2 sm:text-[10px] sm:px-3 sm:py-1 md:text-sm md:px-4 md:py-2"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Additional Notes */}
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        <p className="text-[#B5B4AD] mb-3 text-xs sm:text-[10px] md:text-sm">ADDITIONAL NOTES</p>
        <p className="text-[#D8D6CF] leading-relaxed text-sm sm:text-xs md:text-base">
          {job.additionalProjectInfo ?? "Artisans selected for this project will receive a bonus for exceptional work and have the opportunity to collaborate on future collections."}
        </p>
      </div>

      {/* Attached Files - DYNAMIC */}
      {(jobFiles.length > 0 || jobImages.length > 0 || job.contextLink) && (
        <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
          <p className="text-[#B5B4AD] mb-4 text-xs sm:text-[10px] md:text-sm">ATTACHED FILES</p>
          <AttachedFiles files={[...jobFiles, ...jobImages]} />
          
          {job.contextLink && (
            <>
              <p className="text-[#B5B4AD] mb-2 mt-4 text-xs sm:text-[10px] md:text-sm">ATTACHED LINKS</p>
              <a
                href={job.contextLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 underline text-xs sm:text-[10px] md:text-sm"
                style={{ color: '#04DF76' }}
              >
                Example Design Inspiration
              </a>
            </>
          )}
        </div>
      )}

      {/* Apply Button - FIXED with onClick handler */}
      <div className="flex items-center gap-2 w-full sm:gap-1 md:gap-4">
        <button 
          onClick={onApplyClick}
          className="text-[#1A1203] font-bold rounded-md py-2 px-4 hover:opacity-90 transition-opacity text-xs sm:text-[10px] sm:py-1 sm:px-3 md:text-base md:py-3 md:px-6"
          style={{ backgroundColor: '#FFD700' }}
        >
          APPLY FOR JOB
        </button>
        <button 
          className="flex items-center gap-1 hover:opacity-80 transition-opacity text-xs sm:text-[10px] sm:gap-[2px] md:text-base md:gap-2"
          style={{ color: '#FFCC6D' }}
        >
          <Image src="/market/warning.svg" alt="Warning" width={12} height={12} className="sm:w-[10px] sm:h-[10px] md:w-4 md:h-4" />
          <span>Report this Job</span>
        </button>
      </div>

      {/* Client Info and Similar Jobs - Combined */}
      <div className="bg-[#F2E8CF0A] rounded-lg w-full p-4">
        {/* Client Info */}
        <p className="text-[#B5B4AD] mb-4 text-xs sm:text-[10px] md:text-sm">CLIENT INFO</p>
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <span className="text-[#D8D6CF] text-sm sm:text-xs md:text-base">
              {jobClient.walletAddress
                ? `${jobClient.walletAddress.slice(0, 7)}...${jobClient.walletAddress.slice(-4)}`
                : '0x765k...abvc'}
            </span>
            <span
              className="text-[#F0FCF6] text-xs px-2 py-1 rounded-full sm:text-[10px] sm:px-1 md:text-xs md:px-2"
              style={{ backgroundColor: '#04DF76' }}
            >
              Verified
            </span>
          </div>
          <p className="text-[#D8D6CF] text-sm sm:text-xs md:text-base">
            {jobClient.about ??
              job.clientDescription ??
              "We're a boutique clothing line based in Lagos, passionate about contemporary designs and collaborations with creative artisans"}
          </p>
          <div className="flex gap-4 items-center">
            <Image src="/market/calendar-tick.svg" alt="Calendar" width={14} height={14} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="text-[#B5B4AD] text-xs sm:text-xs md:text-base">
              Joined {jobClient.dateJoined ? new Date(jobClient.dateJoined).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'January 2024'}
            </span>
            {isArtisan ? (
              <button 
                onClick={handleViewProfile}
                className="bg-[#262208] text-[#FCF8E3] py-1 px-6 rounded text-xs whitespace-nowrap inline-block w-auto md:py-2 md:px-4 md:rounded-full md:text-sm hover:bg-[#3a3012] transition-colors cursor-pointer sm:text-[10px] sm:px-3"
                style={{ minWidth: '80px' }}
              >
                View Profile
              </button>
            ) : (
              <span className="bg-[#1a1a1a] text-[#666] py-1 px-6 rounded text-xs whitespace-nowrap inline-block w-auto md:py-2 md:px-4 md:rounded-full md:text-sm cursor-not-allowed sm:text-[10px] sm:px-3">
                View Profile
              </span>
            )}
          </div>
        </div>

        {/* Similar Jobs */}
        <p className="text-[#B5B4AD] mb-2 text-xs sm:text-[10px] md:text-sm">SIMILAR JOBS</p>
        <p className="text-[#D8D6CF] text-sm mb-4 sm:text-xs md:text-base">
          Explore other related opportunities to this project.
        </p>
        <div className="space-y-3">
          <a
            href="/marketplace"
            className="block italic hover:opacity-80 transition-opacity text-sm sm:text-xs md:text-base"
            style={{ color: '#FAB427' }}
          >
            • Tailor Needed for Wedding Gowns - $800 Budget
          </a>
          <a
            href="/marketplace"
            className="block italic hover:opacity-80 transition-opacity text-sm sm:text-xs md:text-base"
            style={{ color: '#FAB427' }}
          >
            • Seamstress for Kids&apos; Clothing Line - $600 Budget
          </a>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;