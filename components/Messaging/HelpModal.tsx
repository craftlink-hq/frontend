import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import Modal from "../Modal"; // Adjust import path as needed

interface MessagingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "How do I start a conversation with an artisan?",
    answer: "Once you hire an artisan, a chat is automatically created. You can start messaging them immediately."
  },
  {
    id: 2,
    question: "What happens when I mark a job as completed?",
    answer: "Marking a job as completed notifies the artisan and ends the active engagement. You will still be able to view the chat, but you can't reopen the job unless you create a new one."
  },
  {
    id: 3,
    question: "How do I dispute a job or raise an issue?",
    answer: "Inside your chat with the artisan, click the \"Report Issue\" button or use the \"Report a Problem\" option in this menu."
  }
];

const MessagingHelpModal: React.FC<MessagingHelpModalProps> = ({ isOpen, onClose }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([1]); // First item expanded by default

  const toggleExpand = (id: number) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <Modal closeFn={onClose}>
      <div className="bg-[#333333] rounded-lg p-6 max-w-md w-full mx-4 text-white">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3 pb-2 border-b-[3px] border-[#FFD700]">
            Need Help With Messaging?
          </h2>
          <p className="text-[#B5B4AD] text-sm leading-relaxed">
            Stuck while chatting with an artisan? Need clarity on what to do next? 
            Here are some quick answers that might help.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqData.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            
            return (
              <div key={item.id} className="bg-[#FFFFFF40] border border-[#F2E8CF0A] rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:text-[#F9F1E2] transition-colors"
                >
                  <span className="text-white font-medium pr-4">
                    {item.question}
                  </span>
                  <div className="flex-shrink-0 text-[#B5B4AD]">
                    {isExpanded ? (
                      <IoChevronUp size={20} />
                    ) : (
                      <IoChevronDown size={20} />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <p className="text-[#B5B4AD] text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default MessagingHelpModal;