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
      className="flex items-center justify-center p-8 rounded-lg h-full"
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
      className="p-8 rounded-lg flex flex-col justify-center h-full"
      style={{ backgroundColor: '#120F0040' }}
    >
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight whitespace-pre-line">
        {title}
      </h3>
      <p className="text-gray-300 text-base md:text-lg leading-relaxed">
        {description}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[200px] md:min-h-[250px]">
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
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
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