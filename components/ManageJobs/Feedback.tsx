"use client"
import { useState } from "react";
import { useGetUserRole } from "@/utils/store";
import { IoIosStarOutline, IoIosStar } from "react-icons/io";

interface FiveStarRatingProps {
  onRatingChange?: (rating: number) => void;
}

const FiveStarRating: React.FC<FiveStarRatingProps> = ({ onRatingChange }) => {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const handleRating = (rate: number) => {
    setRating(rate);
    if (onRatingChange) onRatingChange(rate);
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;

        return (
          <button
            key={starIndex}
            onClick={() => handleRating(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(0)}
            className="cursor-pointer"
          >
            {starIndex <= (hover || rating) ? (
              <IoIosStar size={32} color="#FAB427" />
            ) : (
              <IoIosStarOutline size={32} color="#FAB427" />
            )}
          </button>
        );
      })}
    </div>
  );
};




interface FeedbackProps {
  onCancel: () => void;
}

const Feedback = ({ onCancel }: FeedbackProps) => {
  const [review, setReview] = useState("");
  const { role } = useGetUserRole();
  const handleRatingChange = (rating: number) => {
    console.log("Selected Rating:", rating);
  };

  // Determine heading text based on role
  let roleText = "client";
  if (role === "client") {
    roleText = "artisan";
  } else if (role === "artisan") {
    roleText = "client";
  }

  return (
    <div className="rounded-md bg-[#333333] flex flex-col text-[#FCFBF7] p-4 gap-y-8">
      <div>
        <h2 className="font-alata text-[#F9F1E2] text-2xl lg:text-3xl">
          How would you rate your experience with the {roleText}?
        </h2>
        <h4 className="text-[#B5B4AD]">
          Your feedback is crucial in helping us ensure a great experience for
          both artisans and clients.
        </h4>
      </div>
      <div>
        <p>Rating</p>
        <FiveStarRating onRatingChange={handleRatingChange} />
      </div>
      <div className="w-full">
        <p>Review</p>
        <textarea
          placeholder={`Write a review for this ${roleText} `}
          className="h-44 focus:outline-[#262208] w-[80%] md:w-[70%] lg:w-[100%] font-merriweather bg-[#F2E8CF29] rounded-md placeholder:px-2 text-[#FCFBF7] placeholder:italic px-4 py-2"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>
      <div className="flex justify-between font-merriweather">
        <button
          className="hidden md:flex  w-fit py-2 px-4 uppercase  bg-[#262208] rounded-md text-[#FCF8E3] font-bold"
          onClick={onCancel}
        >
          SKIP FOR NOW
        </button>
        <button
          className="flex md:hidden  w-fit py-2 px-4 uppercase  bg-[#262208] rounded-md text-[#FCF8E3] font-bold"
          onClick={onCancel}
        >
          SKIP
        </button>
        <button className="hidden md:flex rounded-md bg-yellow uppercase py-2 px-4 font-bold text-[#1A1203] ">
          GIVE FEEDBACK
        </button>
        <button className="flex md:hidden  rounded-md bg-yellow uppercase py-2 px-4 font-bold text-[#1A1203] ">
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default Feedback;
