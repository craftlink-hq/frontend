"use client";

import { useState } from "react";
import { useGetUserRole } from "@/utils/store";
import { toast } from "sonner";
import FiveStarRating from "./FiveStarRating";
import IPFS from "@/hooks/useIPFS";
import { useClientSubmitReview } from "@/hooks/Gasless/useClientSubmitReview";
import { useArtisanSubmitReview } from "@/hooks/Gasless/useArtisanSubmitReview";
import Loading from "../Loading";

interface FeedbackProps {
  onCancel: () => void;
  databaseId: string; // Added to identify the gig
}

const Feedback: React.FC<FeedbackProps> = ({ onCancel, databaseId }) => {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const { role } = useGetUserRole();
  const { clientSubmitReview, isLoading: clientLoading } = useClientSubmitReview();
  const { artisanSubmitReview, isLoading: artisanLoading } = useArtisanSubmitReview();
  const { uploadToIPFS } = IPFS();

  const handleRatingChange = (rating: number) => {
    console.log("Selected Rating:", rating);
    setRating(rating);
  };

  const handleSubmitReview = async () => {
    if (!review.trim()) {
      toast.error("Please write a review before submitting.");
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }
    if (!databaseId) {
      toast.error("Gig ID is missing.");
      return;
    }

    let commentHash: string;
    try {
      commentHash = await uploadToIPFS(review);
    } catch (ipfsError) {
      toast.error("Failed to upload review to IPFS");
      console.error("IPFS upload error:", ipfsError);
      return;
    }

    try {
      let success;
      if (role === "client") {
        success = await clientSubmitReview(databaseId, rating, commentHash);
      } else if (role === "artisan") {
        success = await artisanSubmitReview(databaseId, rating, commentHash);
      } else {
        toast.error("You must be a client or artisan to submit a review.");
        return;
      }

      if (success) {
        setReview("");
        setRating(0);
        setHover(0);
        toast.success("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      // Error handling is already managed by the hooks via toasts
    }
  };

  // Determine heading text based on role
  let roleText = "client";
  if (role === "client") {
    roleText = "artisan";
  } else if (role === "artisan") {
    roleText = "client";
  }

  const checkLoadingState = role === "client" ? clientLoading : role === "artisan" ? artisanLoading : false;

  return (
    <Loading show={checkLoadingState}>
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
        <FiveStarRating
          rating={rating}
          setRating={setRating}
          hover={hover}
          setHover={setHover}
          onRatingChange={handleRatingChange}
        />
      </div>
      <div className="w-full">
        <p>Review</p>
        <textarea
          placeholder={`Write a review for this ${roleText}`}
          className="h-44 focus:outline-[#262208] w-[80%] md:w-[70%] lg:w-[100%] font-merriweather bg-[#F2E8CF29] rounded-md placeholder:px-2 text-[#FCFBF7] placeholder:italic px-4 py-2"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>
      <div className="flex justify-between font-merriweather">
        <button
          className="hidden md:flex w-fit py-2 px-4 uppercase bg-[#262208] rounded-md text-[#FCF8E3] font-bold"
          onClick={onCancel}
        >
          SKIP FOR NOW
        </button>
        <button
          className="flex md:hidden w-fit py-2 px-4 uppercase bg-[#262208] rounded-md text-[#FCF8E3] font-bold"
          onClick={onCancel}
        >
          SKIP
        </button>
        <button
          className="hidden md:flex rounded-md bg-yellow uppercase py-2 px-4 font-bold text-[#1A1203]"
          onClick={handleSubmitReview}
        >
          GIVE FEEDBACK
        </button>
        <button
          className="flex md:hidden rounded-md bg-yellow uppercase py-2 px-4 font-bold text-[#1A1203]"
          onClick={handleSubmitReview}
        >
          SUBMIT
        </button>
      </div>
    </div>
    </Loading>
  );
};

export default Feedback;