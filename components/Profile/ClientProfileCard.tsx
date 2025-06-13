"use client";

import Image from "next/image";
import type { Client } from "@/utils/job";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../Modal";
import AnimatedDiv from "@/components/AnimatedDiv";
import EditProfile from "./EditModals/EditProfile";
import { editProfile } from "@/utils/profile";

interface ClientProfileCardProps {
  client: Client;
}

const ClientProfileCard = ({ client }: ClientProfileCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(editProfile);

  const router = useRouter();

  const handlePostJobs = () => {
    router.push("/post-job");
  };

  // const handleEdit = () => {
  //   router.push("/edit-profile");
  // };

  return (
    <div className="h-full bg-[#F2E8CF0A] rounded-lg p-6 border border-[#FCFBF726] text-[#F9F1E2] font-merriweather">
      <div className="flex justify-end ">
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="bg-[#262208] rounded-full flex items-center px-3 py-2 gap-x-2 text-sm hover:bg-[#262208]/80 transition-colors"
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

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="relative h-48 w-48 mb-4">
            <Image
              src={client.avatar || "/placeholder.svg"}
              alt="Profile avatar"
              fill
              className="object-cover rounded-xl"
            />
            <button className="absolute right-2 top-2 bg-[#262208] rounded-full p-2 hover:bg-[#262208]/80 transition-colors">
              <span className="relative h-5 w-5">
                <Image
                  src="/edit.png"
                  alt="edit"
                  fill
                  className="object-contain"
                />
              </span>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-[#FCF8F0] uppercase">
                #{client.username}
              </h2>
              <span className="flex text-[#F0FCF6] text-xs px-2 py-1 bg-[#04DF7621] border rounded-full border-[#04DF76]">
                Verified
              </span>
            </div>
            <p className="text-[#D8D6CF] mb-4">{client.about}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-5 gap-2  text-sm">
            <div className="border-r border-[#FCFBF726]">
              <div className="flex items-center gap-2 text-[#B5B4AD] mb-1">
                <Image
                  src="/location.png"
                  alt="location"
                  width={14}
                  height={14}
                />
                <span>Location</span>
              </div>
              <p className="text-[#F9F1E2]">{client.location}</p>
            </div>

            <div className="border-r border-[#FCFBF726]">
              <div className="flex items-center gap-2 text-[#B5B4AD] mb-1">
                <Image
                  src="/language.png"
                  alt="language"
                  width={14}
                  height={14}
                />
                <span>Language</span>
              </div>
              <p className="text-[#F9F1E2]">{client.language}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-[#B5B4AD] mb-1">
                <Image
                  src="/totalJobs.png"
                  alt="language"
                  width={14}
                  height={14}
                />
                <span>Hiring History</span>
              </div>
              <p className="text-[#F9F1E2]">{client.posted} Jobs posted</p>
            </div>
          </div>

          <button
            onClick={handlePostJobs}
            className="bg-yellow text-[#1A1203] font-bold px-6 py-2 rounded-[4px] uppercase text-sm hover:bg-yellow/90 transition-colors"
          >
            Post Jobs
          </button>
        </div>
      </div>
      {isModalOpen && (
        <Modal closeFn={() => setIsModalOpen(false)}>
          <AnimatedDiv
            initialX="200%"
            animateX={0}
            exitX={"-100%"}
            duration={0.5}
            className="bg-[#333333] border border-[#FCFBF726] md:w-[60vw] h-[90vh] rounded-xl p-4 relative  "
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

export default ClientProfileCard;
