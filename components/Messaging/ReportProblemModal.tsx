import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import Modal from "../Modal"; // Your existing Modal component

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: string;
  walletAddress?: string;
}

const issueTypes = [
  "Payment Issue",
  "Communication Problem", 
  "Work Quality Issue",
  "Technical Problem",
  "Account Issue",
  "Other"
];

const ReportProblemModal: React.FC<ReportProblemModalProps> = ({ 
  isOpen, 
  onClose, 
  subject = "Messaging Help",
  walletAddress = "0x31F4...B98C"
}) => {
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [description, setDescription] = useState<string>("");
  const maxChars = 300;

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log({
      subject,
      walletAddress,
      issueType: selectedIssue,
      description
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal closeFn={onClose}>
      <div className="bg-[#333333] rounded-lg p-6 max-w-md w-full mx-4 text-white">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3 pb-2 border-b-[3px] border-[#FFD700]">
            Report a Problem
          </h2>
          <p className="text-[#B5B4AD] text-sm leading-relaxed">
            Let us know what is going wrong so we can step in and help
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Subject:
            </label>
            <div className="inline-block bg-[#4A4A4A] px-3 py-1 rounded-full text-[#B5B4AD] text-sm">
              {subject}
            </div>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Wallet Address:
            </label>
            <div className="inline-block bg-[#4A4A4A] px-3 py-1 rounded-full text-[#B5B4AD] text-sm font-mono">
              {walletAddress}
            </div>
          </div>

          {/* Issue Type Dropdown */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              What is the issue?
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-[#4A4A4A] border border-[#5A5A5A] rounded-lg px-4 py-3 text-left text-[#B5B4AD] hover:border-[#6A6A6A] transition-colors flex items-center justify-between"
              >
                <span>
                  {selectedIssue || "Select issue type"}
                </span>
                <IoChevronDown 
                  size={20} 
                  className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-[#4A4A4A] border border-[#5A5A5A] rounded-lg shadow-lg z-10">
                  {issueTypes.map((issue) => (
                    <button
                      key={issue}
                      onClick={() => {
                        setSelectedIssue(issue);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-[#B5B4AD] hover:bg-[#5A5A5A] transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description Textarea */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Tell us what happened
            </label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                placeholder="Briefly explain the problem or what you need help with"
                className="w-full bg-[#4A4A4A] border border-[#5A5A5A] rounded-lg px-4 py-3 text-white placeholder-[#7A7A7A] resize-none h-32 hover:border-[#6A6A6A] focus:border-[#FFD700] focus:outline-none transition-colors"
              />
              <div className="absolute bottom-3 right-3 text-[#7A7A7A] text-xs">
                {description.length}/{maxChars}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedIssue || !description.trim()}
            className="w-full bg-[#FFD700] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#E6C200] disabled:bg-[#666666] disabled:text-[#999999] disabled:cursor-not-allowed transition-colors mt-6"
          >
            SEND TO SUPPORT
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportProblemModal;