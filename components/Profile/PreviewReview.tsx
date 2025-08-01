"use client";


import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { ReviewsProp } from "@/utils/profile";
import Image from "next/image";

const PreviewReview = ({ reviews }: { reviews: ReviewsProp[] }) => {
  const [selectedReview, setSelectedReview] = useState<ReviewsProp | null>(null);

  return (
    <div className="flex font-merriweather text-[#F9F1E2] p-4 md:p-8 bg-profile border border-[#FCFBF726] rounded-lg h-full gap-y-8 max-w-full flex-col">
      <h3 className="text-2xl font-bold">Reviews</h3>
      <div className="min-w-screen flex overflow-x-scroll gap-x-4">
        {(!reviews || reviews.length === 0) ? (
          <div className="w-full text-center text-[#D8D6CF] py-8 text-lg font-semibold col-span-full">
            No Reviews yet!
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              onClick={() => setSelectedReview(review)}
              className="bg-[#F2E8CF0A] rounded-lg flex-shrink-0 w-full md:w-[35%]  flex flex-col items-start px-4 py-2 md:p-2 gap-y-4"
            >
              <h4 className="text-lg md:text-xl text-[#F9F1E2] font-bold">
                {review.reviewer.slice(0, 4)}...{review.reviewer.slice(-4)}
              </h4>
              <div className="border-l-[3px] border-[#FCFBF726] px-2 text-[#B5B4AD] text-sm">
                {review.review}
              </div>
              <div className=" flex font-merriweather font-bold gap-x-2 w-full self-end justify-end">
                <span className="relative h-[20px] w-[20px] ">
                  <Image
                    src="/star.png"
                    alt="star"
                    fill
                    style={{ objectFit: "contain", objectPosition: "center" }}
                  />
                </span>
                <p className="italic font-bold text-[#FCF8E3]">
                  ({review.rating}/5)
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Popup Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 h-[100vh] bg-[#F2E8CF0A] w-screen bg-opacity-90 backdrop-blur-sm flex items-center justify-center ">
          <div className="relative bg-profile   rounded-lg p-8 md:min-w-[35%] md:max-w-[60%] md:min-h-[40%] border border-[#FCFBF726] flex ">
            <div className="flex flex-col">
              <span className="text-lg font-alata text-[#F9F1E2] mb-2">  {selectedReview.reviewer.slice(0, 4)}...{selectedReview.reviewer.slice(-4)}
</span>
              <span className="text-[#B5B4AD]">{selectedReview.review}</span>
            </div>
            <button
              className="absolute top-0 right-1 rounded"
              onClick={() => setSelectedReview(null)}
            >
              <IoCloseSharp size={20} />

            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewReview;
