import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CoreValue {
  id: number;
  title: string;
  description: string;
}

const CoreValues: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const coreValues: CoreValue[] = [
    {
      id: 1,
      title: "Trust First",
      description: "We build with trust at the center. From secure payments to clear communication and fair job processes."
    },
    {
      id: 3,
      title: "Craft Over Noise",
      description: "We value genuine skill and dedication over hype, spotlighting the quality of your craft, not just the noise."
    },
    {
      id: 2,
      title: "Equal Access",
      description: "We believe everyone deserves a seat at the table—regardless of location, background, or experience level."
    },
    {
      id: 4,
      title: "Growth-Minded",
      description: "We're here to support artisans in building sustainable careers, and they can grow with us. When you grow, we grow."
    }
  ];

  // Create extended array with duplicate first slide at the end for seamless loop
  const extendedValues = [...coreValues, coreValues[0]];

  // Auto-play functionality (only for mobile carousel)
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Handle seamless loop (only for mobile carousel)
  useEffect(() => {
    if (currentIndex === coreValues.length) {
      // When we reach the duplicate slide, wait for transition to complete
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0); // Jump to real first slide
        setTimeout(() => setIsTransitioning(true), 50); // Re-enable transitions
      }, 500);
    }
  }, [currentIndex, coreValues.length]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < coreValues.length) {
      setCurrentIndex(index);
      setIsAutoPlaying(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex === 0) {
      setCurrentIndex(coreValues.length - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex + 1);
    setIsAutoPlaying(false);
  };

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext(); // Swipe left = go to next (right to left animation)
    } else if (isRightSwipe) {
      goToPrevious(); // Swipe right = go to previous
    }
  };

  return (
    <section className="bg-[#333333] py-16 lg:py-24">
      <div className="w-full">
        {/* Title */}
        <div className="px-6 lg:px-12 xl:px-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semi-bold tracking-wide text-[#F9F1E2] mb-16 lg:mb-24">
            CORE VALUES
          </h2>
        </div>
        
        {/* Desktop Grid View (md and up) */}
        <div className="hidden md:block px-6 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {coreValues.map((value) => (
              <div key={value.id} className="relative bg-[#F2E8CF0A] rounded-lg p-8 lg:p-10 xl:p-12 h-80 lg:h-96 xl:h-[420px] overflow-hidden hover:bg-[#F2E8CF15] transition-colors duration-300">
                {/* Yellow icon square */}
                <div className="bg-[#FFD700] w-12 h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 flex items-center justify-center mb-6 lg:mb-8">
                  <Image
                    src="/articon.svg"
                    alt="Core value icon"
                    width={24}
                    height={24}
                    className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
                  />
                </div>
                
                {/* Title */}
                <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold mb-6 lg:mb-8 text-white">
                  {value.title}
                </h3>
                
                {/* Description */}
                <p className="text-[#B0B0B0] text-base lg:text-lg xl:text-xl leading-relaxed">
                  {value.description}
                </p>
                
                {/* Large number overlay - positioned in bottom right */}
                <div className="absolute bottom-6 lg:bottom-8 xl:bottom-10 right-6 lg:right-8 xl:right-10 text-7xl lg:text-8xl xl:text-9xl font-bold text-[#F2E8CF29] opacity-20 lg:opacity-30 leading-none">
                  #{value.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel View (below md) */}
        <div className="md:hidden px-6">
          {/* Carousel Container */}
          <div 
            className="relative overflow-hidden rounded-lg"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {extendedValues.map((value, index) => (
                <div 
                  key={`${value.id}-${index}`}
                  className="w-full flex-shrink-0"
                >
                  <div className="bg-[#F2E8CF0A] rounded-lg p-6 h-56 relative overflow-hidden">
                    {/* Yellow icon square */}
                    <div className="bg-[#FFD700] w-10 h-10 flex items-center justify-center mb-4">
                      <Image
                        src="/articon.svg"
                        alt="Core value icon"
                        width={20}
                        height={20}
                        className="w-4 h-4"
                      />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold mb-3 text-white">
                      {value.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[#B0B0B0] text-sm leading-relaxed">
                      {value.description}
                    </p>
                    
                    {/* Large number overlay */}
                    <div className="absolute bottom-4 right-4 text-5xl font-bold text-[#F2E8CF29] opacity-20 leading-none select-none">
                      #{value.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex justify-between items-center mt-8">
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className="bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1203] rounded-full p-3 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Pagination Dots */}
            <div className="flex justify-center items-center space-x-3">
              {coreValues.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === (currentIndex % coreValues.length)
                      ? 'bg-[#FFD700] scale-125' 
                      : 'bg-[#666666] hover:bg-[#888888]'
                  }`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className="bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1203] rounded-full p-3 transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Swipe indicator */}
          <div className="flex justify-center mt-4">
            <p className="text-[#B0B0B0] text-sm">Swipe to navigate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;