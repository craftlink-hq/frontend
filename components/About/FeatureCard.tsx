import React from 'react';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  iconPath: string;
  imageOnLeft: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  iconPath, 
  imageOnLeft 
}) => {
  const ImageDiv = () => (
    <div 
      className="flex items-center justify-center p-6 md:p-8 rounded-lg h-[160px] md:h-full"
      style={{ backgroundColor: '#F2E8CF0A' }}
    >
      <Image 
        src={iconPath} 
        alt={title}
        width={120}
        height={120}
        className="w-20 h-20 md:w-24 md:h-24"
      />
    </div>
  );

  const TextDiv = () => (
    <div 
      className="p-6 md:p-8 rounded-lg flex flex-col justify-center h-[160px] md:h-full"
      style={{ backgroundColor: '#120F0040' }}
    >
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 leading-tight whitespace-pre-line" style={{ color: '#F9F1E2', fontFamily: 'Alata, sans-serif' }}>
        {title}
      </h3>
      <p className="text-sm md:text-base lg:text-lg leading-relaxed" style={{ color: '#F9F1E2', fontFamily: 'Merriweather, serif' }}>
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-[340px] md:min-h-[250px]">
      {/* Mobile Layout - Always Text first, then Image */}
      <div className="flex flex-col gap-2 md:hidden">
        <TextDiv />
        <ImageDiv />
      </div>
      
      {/* Desktop Layout - Respects imageOnLeft prop */}
      <div className="hidden md:grid md:grid-cols-2 gap-2 h-full">
        {imageOnLeft ? (
          <>
            <ImageDiv />
            <TextDiv />
          </>
        ) : (
          <>
            <TextDiv />
            <ImageDiv />
          </>
        )}
      </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: "Easy Payments\nIn & Out",
      description: "Pay in crypto or local currency. Withdraw earnings however it suits you—securely and fast.",
      iconPath: "/Group1.svg",
      imageOnLeft: false // Text left, Image right
    },
    {
      title: "Smart Matching",
      description: "Our platform recommends top artisans based on your project needs, location, and timeline—so you hire with confidence.",
      iconPath: "/Group2.svg",
      imageOnLeft: true // Image left, Text right
    },
    {
      title: "Direct\nCommunication",
      description: "Message artisans directly to discuss job progress, share updates, and keep everything on track—all in one place.",
      iconPath: "/Group3.svg",
      imageOnLeft: false // Text left, Image right
    },
    {
      title: "Guaranteed\nPayments",
      description: "We hold funds securely until the job is done. No chasing, no delays—just peace of mind.",
      iconPath: "/Group4.svg",
      imageOnLeft: true // Image left, Text right
    }
  ];

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: '#333333' }}>
      <div className="w-full px-4 md:px-8 lg:px-12">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              {...feature}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;