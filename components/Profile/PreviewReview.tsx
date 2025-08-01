"use client";

import { useState, useEffect } from "react";
import { ReviewsProp } from "@/utils/profile";
import Image from "next/image";

const PreviewReview = ({ reviews }: { reviews: ReviewsProp[] }) => {
  const [currentView, setCurrentView] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(true); // Default to mobile for SSR

  // Handle responsive breakpoint
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkIfMobile();

    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Calculate slides based on screen size
  const cardsPerSlide = isMobile ? 1 : 2;
  const totalSlides = reviews.length === 0 ? 0 : Math.ceil(reviews.length / cardsPerSlide);

  // Reset to first slide when switching between mobile/desktop
  useEffect(() => {
    if (currentView >= totalSlides && totalSlides > 0) {
      setCurrentView(0);
    }
  }, [isMobile, totalSlides, currentView]);

  return (
    <div className="flex font-merriweather text-[#F9F1E2] p-4 md:p-8 bg-profile border border-[#FCFBF726] rounded-lg h-full gap-y-8 w-full flex-col">
      <h3 className="text-2xl font-bold">Review</h3>

      {reviews.length === 0 ? (
        <div className="w-full text-center text-[#D8D6CF] py-8 text-lg font-semibold">
          <span>No reviews yet</span>
          <p className="text-sm text-[#B5B4AD] px-2">
            This client hasn’t received any reviews from artisans. Once they complete a project, feedback will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Carousel Container with proper overflow handling */}
          <div className="w-full overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(-${currentView * 100}%)`,
                width: `${totalSlides * 100}%`,
              }}
            >
              {/* Generate slides */}
              {Array.from({ length: totalSlides }, (_, slideIndex) => {
                const slideReviews = reviews.slice(
                  slideIndex * cardsPerSlide,
                  slideIndex * cardsPerSlide + cardsPerSlide
                );

                return (
                  <div
                    key={slideIndex}
                    className="flex-shrink-0 w-full px-2 first:pl-0 last:pr-0"
                    style={{ width: `${100 / totalSlides}%` }}
                  >
                    <div className={`grid gap-4 h-full ${isMobile ? 'grid-cols-1' : slideReviews.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {slideReviews.map((review, reviewIndex) => (
                        <div
                          key={`${review.id}-${slideIndex}-${reviewIndex}`}
                          className="bg-[#F2E8CF0A] border-[0.5px] backdrop-blur-sm opacity-[200%] border-[#FCFBF726] rounded-lg min-h-[20vh] flex flex-col justify-between p-4 gap-y-4 w-full"
                        >
                          <h4 className="text-lg md:text-xl text-[#F9F1E2] font-bold break-words">
                            {review.reviewer.slice(0, 4)}...{review.reviewer.slice(-4)}
                          </h4>
                          <div className="border-l-[3px] border-[#FCFBF726] px-2 text-[#B5B4AD] text-sm  break-words flex-1">
                            {review.review}
                          </div>
                          <div className="flex font-merriweather font-bold gap-x-2 w-full justify-end mt-auto">
                            <span className="relative h-[18px] w-[18px] md:h-[20px] md:w-[20px] flex-shrink-0">
                              <Image
                                src="/star.png"
                                alt="star"
                                fill
                                style={{ objectFit: "contain", objectPosition: "center" }}
                              />
                            </span>
                            <p className="italic font-bold text-[#FCF8E3] text-sm md:text-base">
                              ({review.rating}/5)
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation dots - only show if more than 1 slide */}
          {totalSlides > 1 && (
            <div className="flex justify-center space-x-2 mt-4">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-colors duration-200 ${currentView === index ? "bg-[#FFD700]" : "bg-gray-400"
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