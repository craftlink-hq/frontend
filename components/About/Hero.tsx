// components/HeroSection.jsx
import Image, { StaticImageData } from "next/image";
import React from "react";

interface HeroSectionProps {
  headline: string;
  description: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  accentColor?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const HeroSection = ({
  headline,
  description,
  imageSrc,
  imageAlt,
  accentColor = "#FFD700",
  buttonText,
  onButtonClick,
}: HeroSectionProps) => {
  return (
    <section 
      className="min-h-[60vh] lg:min-h-[70vh] px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-20 flex items-center"
      style={{ backgroundColor: "#3c3c3c" }}
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Mobile: Flex column (image top, text bottom) | Desktop: Grid (text left, image right) */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Image - Order 1 on mobile (appears first/top), Order 2 on desktop (right side) */}
          <div className="relative w-full order-1 lg:order-2">
            <div 
              className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-full h-full rounded-lg z-0"
              style={{ backgroundColor: accentColor }}
            />
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-lg overflow-hidden z-10 w-full">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          {/* Text Content - Order 2 on mobile (appears second/bottom), Order 1 on desktop (left side) */}
          <div className="text-white space-y-4 sm:space-y-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#F9F1E2] leading-tight">
              {headline}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {description}
            </p>
            {buttonText && (
              <button
                onClick={onButtonClick}
                className="px-6 sm:px-8 py-3 mt-4 text-white font-semibold rounded-lg border-2 transition-all duration-300 hover:bg-opacity-10 hover:bg-white text-sm sm:text-base"
                style={{ 
                  backgroundColor: "#3c3c3c",
                  borderColor: accentColor 
                }}
              >
                {buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;