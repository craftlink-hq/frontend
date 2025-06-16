"use client"

import { IoClose, IoInformationCircleOutline } from "react-icons/io5"

interface HireConfirmationModalProps {
  onClose: () => void
  onConfirm: () => void
  onCancel: () => void
  artisanName: string
  projectTitle: string
  budget: number
  duration: string
}

const HireConfirmationModal = ({
  onClose,
  onConfirm,
  onCancel,
  artisanName,
  projectTitle,
  budget,
  duration,
}: HireConfirmationModalProps) => {
  return (
    <div className="bg-[#2A2A2A] rounded-lg p-6 w-full max-w-md text-[#F9F1E2] font-merriweather relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#B5B4AD] hover:text-[#F9F1E2] transition-colors"
      >
        <IoClose className="h-6 w-6" />
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#F9F1E2] mb-1">READY TO HIRE ARTISAN?</h2>
        <div className="w-16 h-1 bg-yellow rounded"></div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-[#B5B4AD] text-sm leading-relaxed">
          You&apos;re about to hire <span className="text-yellow font-medium">[{artisanName}]</span> for your{" "}
          <span className="text-yellow font-medium">{projectTitle}</span> project.
        </p>
      </div>

      {/* Project Details */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-[#F9F1E2] font-medium">Project Details</h3>
          <IoInformationCircleOutline className="h-4 w-4 text-[#B5B4AD]" />
        </div>

        <div className="space-y-4">
          {/* Budget */}
          <div className="flex justify-between items-center">
            <span className="text-[#B5B4AD]">Budget</span>
            <span className="text-[#F9F1E2] font-bold text-lg">${budget.toLocaleString()}</span>
          </div>

          {/* Duration */}
          <div className="flex justify-between items-center">
            <span className="text-[#B5B4AD]">Duration</span>
            <span className="text-[#F9F1E2] font-medium">{duration}</span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="mb-6">
        <p className="text-[#B5B4AD] text-xs italic leading-relaxed">
          Once you confirm, the artisan will be notified and the project will officially begin. Payment will be held in
          escrow until project completion.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-[#1A1A1A] text-[#F9F1E2] font-bold py-3 px-4 rounded uppercase text-sm hover:bg-[#2A2A2A] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 bg-yellow text-[#1A1203] font-bold py-3 px-4 rounded uppercase text-sm hover:bg-yellow/90 transition-colors"
        >
          Yes, Hire
        </button>
      </div>
    </div>
  )
}

export default HireConfirmationModal
