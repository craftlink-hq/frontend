"use client"
import { useRouter } from "next/navigation"

const EmptyChat = () => {
  const router = useRouter()

  const handleBrowseJobs = () => {
    router.push("/browse-jobs")
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 text-center bg-[#333333] relative">
      {/* Left Side Illustration */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="space-y-4">
          <div className="w-48 h-12 bg-[#444444] rounded-lg flex items-center px-4">
            <div className="w-8 h-8 bg-[#666666] rounded-full mr-3"></div>
            <div className="flex-1 space-y-1">
              <div className="w-16 h-2 bg-[#666666] rounded"></div>
              <div className="w-24 h-2 bg-[#666666] rounded"></div>
            </div>
          </div>
          <div className="w-48 h-12 bg-[#444444] rounded-lg flex items-center px-4">
            <div className="w-8 h-8 bg-[#666666] rounded-full mr-3"></div>
            <div className="flex-1 space-y-1">
              <div className="w-20 h-2 bg-[#666666] rounded"></div>
              <div className="w-32 h-2 bg-[#666666] rounded"></div>
            </div>
          </div>
          <div className="w-48 h-12 bg-[#444444] rounded-lg flex items-center px-4">
            <div className="w-8 h-8 bg-[#666666] rounded-full mr-3"></div>
            <div className="flex-1 space-y-1">
              <div className="w-12 h-2 bg-[#666666] rounded"></div>
              <div className="w-28 h-2 bg-[#666666] rounded"></div>
            </div>
          </div>
        </div>
        <p className="text-[#B5B4AD] text-center mt-4 font-medium">Your Chats Will Appear Here</p>
      </div>

      {/* Main Content */}
      <div className="max-w-md z-10">
        {/* Chat Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-[#444444] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-[#666666]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div>
          <h3 className="text-xl font-bold text-[#F9F1E2] mb-4">No Messages Yet</h3>
          <p className="text-[#B5B4AD] text-base leading-relaxed mb-8">
            Once a client responds or hires you, your chats will show up here.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleBrowseJobs}
            className="bg-yellow text-[#1A1203] font-bold py-3 px-8 rounded uppercase text-sm hover:bg-yellow/90 transition-colors"
          >
            BROWSE JOBS
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmptyChat
