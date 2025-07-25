"use client";
import React from "react";
import Modal from "../Modal";
import Image from "next/image";

interface SuccessModalProps {
  onClose: () => void;
  onBrowseJobs?: () => void;
}

const Success: React.FC<SuccessModalProps> = ({
  onClose,
  onBrowseJobs,
}) => {
  const handleBrowseJobs = () => {
    onBrowseJobs?.();
    onClose();
  };

  return (
    <Modal closeFn={onClose}>
      <div className="bg-[#3a3a3a] w-[480px] h-[580px] rounded-2xl p-8 relative shadow-2xl flex flex-col">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-[#9CA3AF] hover:text-white text-xl"
        >
          ×
        </button>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-white font-bold text-2xl tracking-wide">
            SUCCESSFUL
            <div className="w-24 h-1 bg-[#FFD700] mt-2"></div>
          </h1>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Success Icon */}
          <div className="mb-12">
            <Image 
              src="/market/GreenMark.svg" 
              alt="Success"
              width={120}
              height={120}
            />
          </div>

          {/* Success Message */}
          <div className="text-center px-4 mb-16">
            <p className="text-[#D1D5DB] text-lg leading-relaxed">
              Thank you! Your message has been received. Our
            </p>
            <p className="text-[#D1D5DB] text-lg leading-relaxed">
              team will review it and reach out shortly
            </p>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={handleBrowseJobs}
            className="bg-[#4A4A4A] text-[#FFD700] font-bold py-3 px-8 rounded text-sm tracking-wider hover:bg-[#5A5A5A] transition-colors"
          >
            BROWSE JOBS
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Success;