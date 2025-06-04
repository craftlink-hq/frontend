"use client"

import Image from "next/image"
import type { ArtisanProfileProps } from "@/utils/profile"
import { useRouter } from "next/navigation"

interface ProfileCardProps {
  profile: ArtisanProfileProps
}

const ProfileCard = ({ profile }: ProfileCardProps) => {
  const router = useRouter()

  const handleBrowseJobs = () => {
    router.push("/marketplace")
  }

  const handleEdit = () => {
    router.push("/role/artisans/onboarding/bio")
  }

  return (
    <div className="bg-[#F2E8CF0A] h-full rounded-lg p-6 border border-[#FCFBF726] text-[#F9F1E2] font-merriweather">
      <div className="flex justify-end mb-4">
        <button onClick={handleEdit} className="bg-[#262208] rounded-full flex items-center px-3 py-2 gap-x-2 text-sm">
          Edit
          <span className="relative h-6 w-6 rounded-full bg-[#F2E8CF0A]">
            <Image src="/edit.png" alt="edit" fill className="object-contain p-1" />
          </span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <div className="relative h-48 w-48 mb-4">
            <Image
              src={profile.about.avatar || "/placeholder.svg"}
              alt="Profile avatar"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-[#FCF8F0] uppercase">#{profile.about.username}</h2>
              <span className="flex text-[#F0FCF6] text-xs px-2 py-1 bg-[#04DF7621] border rounded-full border-[#04DF76]">
                Verified
              </span>
            </div>
            <p className="text-xl font-semibold text-[#FCF8F0] mb-2">{profile.about.jobTitle}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-[#D8D6CF]">
            <div className="flex items-center gap-2">
              <Image src="/location.png" alt="location" width={16} height={16} />
              <span>{profile.details.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Available to work</span>
            </div>
          </div>

          <button
            onClick={handleBrowseJobs}
            className="bg-yellow text-[#1A1203] font-bold px-6 py-2 rounded-md uppercase text-sm hover:bg-yellow/90 transition-colors"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
