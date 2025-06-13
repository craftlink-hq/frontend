"use client";

import Image from "next/image";
import type { ArtisanProfileProps } from "@/utils/profile";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../Modal";
import AnimatedDiv from "@/components/AnimatedDiv";
import EditProfile from "./EditModals/EditProfile";
import { editProfile } from "@/utils/profile";

interface ProfileCardProps {
  profile: ArtisanProfileProps;
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(editProfile);

  const router = useRouter();

  const handleBrowseJobs = () => {
    router.push("/marketplace");
  };

  return (
    <div className="flex justify-between bg-[#F2E8CF0A] w-full h-[30vh] lg:h-full rounded-lg p-4 border border-[#FCFBF726] text-[#F9F1E2] font-merriweather">
      <div className="flex gap-8 xl:gap-x-16 ">
        <div className="relative h-full w-[25vw]  xl:w-[20vw] mb-4">
          <Image
            src={profile.about.avatar || "/placeholder.svg"}
            alt="Profile avatar"
            fill
            className="object-cover rounded-xl h-full"
          />
        </div>
        <div className="flex flex-col   self-center items-start justify-center space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold font-alata text-[#FCF8F0] uppercase">
                #{profile.about.username}
              </h2>
              <span className="flex text-[#F0FCF6] text-xs px-4 py-1 bg-[#04DF7621] border rounded-full border-[#04DF76]">
                Verified
              </span>
            </div>
            <p className="text-lg font-semibold text-[#D8D6CF] mb-2">
              {profile.about.jobTitle}
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#D8D6CF]">
            <div className="border-r border-[#FCFBF726] pr-4">
              <div className="flex items-center gap-2 text-[#B5B4AD] mb-1">
                <Image
                  src="/location.png"
                  alt="location"
                  width={14}
                  height={14}
                />
                <span className="text-sm">Location</span>
              </div>
              <p className="text-[#F9F1E2]">{profile.details.location}</p>
            </div>
            <div className="">
              <div className="flex items-center gap-2 text-[#B5B4AD] mb-1">
                <Image
                  src="/calendar.png"
                  alt="calendar"
                  width={14}
                  height={14}
                />
                <span className="text-sm">Availability</span>
              </div>
              <span className="text-[#F9F1E2]">Available to work</span>
            </div>
          </div>

          <button
            onClick={handleBrowseJobs}
            className="bg-yellow text-[#1A1203] font-bold px-6 py-2 rounded-[4px] uppercase text-sm hover:bg-yellow/90 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
      <div className=" ">
        <button
          className="bg-[#262208] rounded-full flex items-center px-3 py-2 gap-x-2 text-sm"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Edit{""}
          <span className="relative h-6 w-6 rounded-full bg-[#F2E8CF0A]">
            <Image
              src="/edit.png"
              alt="edit"
              fill
              className="object-contain p-1"
            />
          </span>
        </button>
      </div>
      {isModalOpen && (
        <Modal closeFn={() => setIsModalOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] md:w-[40vw] h-[90vh] rounded-xl p-4 relative  "
          >
            <div className="h-[90%] overflow-y-scroll">
              <EditProfile
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentData={profileData}
                onSave={setProfileData}
              />
            </div>
          </AnimatedDiv>
        </Modal>
      )}
    </div>
  );
};

export default ProfileCard;
