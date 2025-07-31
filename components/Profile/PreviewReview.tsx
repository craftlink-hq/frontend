"use client";

import { useState } from "react";
import { ReviewsProp } from "@/utils/profile";
import Image from "next/image";

const PreviewReview = ({ reviews }: { reviews: ReviewsProp[] }) => {
  const [currentView, setCurrentView] = useState<number>(0);
  
  // Calculate total number of slides (2 cards per slide)
  const totalSlides = Math.ceil(reviews.length / 2);

  return (
    <div className="flex font-merriweather overflow-hidden text-[#F9F1E2] p-4 md:p-8 bg-profile border border-[#FCFBF726] rounded-lg h-full gap-y-8 max-w-full flex-col">
      <h3 className="text-2xl font-bold">Reviews</h3>
      
      {reviews.length === 0 ? (
        <div className="w-full text-center text-[#D8D6CF] py-8 text-lg font-semibold">
          <span>No reviews yet</span>
          <p className="text-sm text-[#B5B4AD] px-2">
            This client hasn&apos;t received any reviews from artisans. Once they complete a project, feedback will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentView * 100}%)`,
              }}
            >
              {/* Group reviews into slides of 2 */}
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="min-w-full flex gap-x-4">
                  {reviews
                    .slice(slideIndex * 2, slideIndex * 2 + 2)
                    .map((review) => (
                      <div
                        key={review.id}
                        className={`bg-[#F2E8CF0A] border-[0.5px] backdrop-blur-sm opacity-[200%] border-[#FCFBF726] rounded-lg min-h-[20vh] flex flex-col justify-between p-4 gap-y-4 ${
                          reviews.slice(slideIndex * 2, slideIndex * 2 + 2).length === 1 
                            ? "w-1/2" 
                            : "flex-1"
                        }`}
                      >
                        <h4 className="text-xl text-[#F9F1E2] font-bold">
                          {review.reviewer}
                        </h4>
                        <div className="border-l-[3px] border-[#FCFBF726] px-2 text-[#B5B4AD] text-lg">
                          {review.review}
                        </div>
                        <div className="flex font-merriweather font-bold gap-x-2 w-full self-end justify-end">
                          <span className="relative h-[20px] w-[20px]">
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
                    ))}
                  
                  {/* Add empty space if only one card in the slide */}
                  {reviews.slice(slideIndex * 2, slideIndex * 2 + 2).length === 1 && (
                    <div className="w-1/2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pagination dots - one dot per slide, not per review */}
          {totalSlides > 1 && (
            <div className="self-center flex space-x-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentView === index ? "bg-[#FFD700]" : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentView(index)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PreviewReview;