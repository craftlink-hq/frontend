// components/HeroSection.jsx
import Image, { StaticImageData } from "next/image";
import React from "react";

interface HeroSectionProps {
  headline: string;
  description: string;
  imageSrc: string | StaticImageData;
  imageAlt: string;
  /** Hex color for the accent border */
  accentColor?: string;
  /** Optional button text */
  buttonText?: string;
  /** Optional button click handler */
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
      className="min-h-[60vh] lg:min-h-[70vh] px-8 lg:px-16 py-16 lg:py-20 flex items-center"
      style={{ backgroundColor: "#3c3c3c" }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Text Content */}
        <div className="text-white space-y-6">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            {headline}
          </h1>
          <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
            {description}
          </p>
          {buttonText && (
            <button
              onClick={onButtonClick}
              className="px-8 py-3 mt-4 text-white font-semibold rounded-lg border-2 transition-all duration-300 hover:bg-opacity-10 hover:bg-white"
              style={{ 
                backgroundColor: "#3c3c3c",
                borderColor: accentColor 
              }}
            >
              {buttonText}
            </button>
          )}
        </div>
        
        {/* Image with Accent Border */}
        <div className="relative">
          <div 
            className="absolute -bottom-4 -right-4 w-full h-full rounded-lg z-0"
            style={{ backgroundColor: accentColor }}
          />
          <div className="relative h-[400px] lg:h-[500px] rounded-lg overflow-hidden z-10">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;