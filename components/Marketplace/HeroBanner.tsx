import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGetUserRole } from '@/utils/store';

const HeroBanner: React.FC = () => {
  const { role } = useGetUserRole();

  // Content based on user role 
  const getContent = () => {
    if (role === 'artisan') {
      return {
        title: "Build, Fix, Design or Hire",
        description: "Looking for skilled hands? Sign in as a client and post your job",
        buttonText: "SIGN IN AS CLIENT",
        subText: "Creating a client account lets you post jobs and connect with the right artisans.",
        buttonLink: "/role/clients/signin",
        showIcon: true
      };
    }
    
    if (role === 'client') {
      return {
        title: "Build, Fix, Design or Hire",
        description: "Craftlink connects you with real people who need your skills — or have the skills you need.",
        buttonText: "POST JOB",
        subText: "",
        buttonLink: "/role/clients/create-job/title",
        showIcon: false
      };
    }
    
    // Default visitor content
    return {
      title: "Build, Fix, Design or Hire",
      description: "Craftlink connects you with real people who need your skills — or have the skills you need.",
      buttonText: "SIGN IN",
      subText: "",
      buttonLink: "/role/artisans/signin",
      showIcon: false
    };
  };

  const content = getContent();

  return (
    <div className="bg-[#333333] bg-opacity-[98%] px-4 lg:px-8 2xl:px-16 py-8 lg:py-12">
      {/* Container Box */}
      <div className="rounded-2xl relative overflow-hidden" style={{ background: '#F2E8CF0A' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
          {/* Left Content */}
          <div className="flex flex-col max-w-2xl w-full lg:w-auto">
            <div className="flex items-start justify-between mb-4 lg:mb-0">
              <h1 className="text-[#F9F1E2] text-[28px] sm:text-[32px] lg:text-[40px] font-normal leading-[120%] mb-6 flex-1 pr-4 lg:pr-0" style={{ fontFamily: 'Alata', letterSpacing: '0%' }}>
                {content.title}
              </h1>
              
              {/* Arrow - show on mobile next to title, hidden on lg+ (desktop absolute positioning takes over) */}
              <div className="lg:hidden flex-shrink-0" style={{
                width: '80px',
                height: '80px'
              }}>
                <Image
                  src="/market/arrow.svg"
                  alt="Arrow pointing to target"
                  width={80}
                  height={80}
                  className="w-full h-full"
                  style={{
                    transform: 'rotate(19.48deg)'
                  }}
                />
              </div>
            </div>
            
            <p className="text-[#B5B4AD] text-lg sm:text-lg lg:text-xl mb-6 lg:mb-8 lg:whitespace-nowrap" style={{ fontFamily: 'Merriweather' }}>
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <Link href={content.buttonLink} className="w-full lg:w-auto">
                <button className="bg-[#FFD700] text-[#1A1203] rounded hover:bg-yellow-400 transition-colors w-full lg:w-[174px] flex items-center justify-center" style={{ 
                  fontFamily: 'Merriweather',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '120%',
                  letterSpacing: '8%',
                  height: '60px'
                }}>
                  {content.buttonText}
                </button>
              </Link>
              
              {content.showIcon && (
                <Image
                  src="/market/info-circle.svg"
                  alt="Info"
                  width={16}
                  height={16}
                  className="mt-3 flex-shrink-0 hidden sm:block"
                />
              )}
              
              {content.subText && (
                <div className="text-[#B5B4AD] rounded px-3 flex items-center hidden sm:flex" style={{ 
                  fontFamily: 'Merriweather',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  width: '215px',
                  height: '60px',
                  backgroundColor: content.showIcon ? '#333333' : 'transparent'
                }}>
                  {content.subText}
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Arrow (Desktop only) */}
          <div className="absolute top-8 right-12 hidden lg:block" style={{
            width: '229.95px',
            height: '229.95px'
          }}>
            <Image
              src="/market/arrow.svg"
              alt="Arrow pointing to target"
              width={230}
              height={230}
              className="w-full h-full"
              style={{
                transform: 'rotate(19.48deg)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;