"use client";

// pages/index.js (or app/page.js for Next.js 13+)
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/About/Hero';
import Section from '@/components/About/Section';
import CoreValues from '@/components/About/CoreValues';
import Image from 'next/image';

const HomePage = () => {
  const router = useRouter();
  
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        headline="We connect skilled hands to paying clients."
        description="More than a platform, we are a growing network of skilled hands, creative minds, and forward-thinkers—united by the goal to work, earn, and grow without limits."
        imageSrc="/hand.svg"
        imageAlt="Skilled craftsman hands at work"
        buttonText="Visit Marketplace"
        onButtonClick={() => router.push('/marketplace')}
      />

      {/* Mission Section */}
      <Section
        title="MISSION"
        content={
          <>
            <p>To empower skilled artisans by connecting them with the right clients through a seamless, job marketplace.</p>
            <p>We strive to make it easy for artisans to get discovered, get hired, and get paid securely and fairly.</p>
            <p>By removing barriers and streamlining access to opportunities, we're building a trusted ecosystem where talent meets demand—from fashion designers and carpenters to tech freelancers, tailors e.t.c.</p>
          </>
        }
        imageSrc="/mission.svg"
        imageAlt="Artisans working together"
        imageOnRight={false}
        showAccentBorder={false}
        isDark={true}
      />

      {/* Vision Section */}
      <Section
        title="VISION"
        content={
          <>
            <p>We envision a borderless, trusted ecosystem where artisans thrive through visibility, opportunity, and fair pay—while clients easily hire and manage the right talent, anytime.</p>
            <p>We're making the informal economy more powerful, one job at a time.</p>
            <p>By removing barriers and streamlining access to opportunities, we're building a trusted ecosystem where talent meets demand—from fashion designers and carpenters to tech freelancers, tailors e.t.c.</p>
          </>
        }
        imageSrc="/vision.svg"
        imageAlt="Artisans working together"
        imageOnRight={true}
        showAccentBorder={false}
        isDark={true}
      />

      {/* Core Values Section */}
      <CoreValues />

      <div className="flex justify-center">
        <div className="flex flex-col relative bg-[#FFD700] items-center md:w-[90%] min-h-[45vh] h-fit w-[95vw] rounded-md py-4 my-4">
          <Image
            src="/bg-blend.png"
            alt="background blend"
            fill
            className="z-20 opacity-70 mix-blend-overlay"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <p className="text-[#0D0800] font-alata text-[24px] sm:text-[40px] md:text-[4vw] self-center text-center w-[80%] md:w-[60%] py-8 md:leading-[60px] lg:leading-[4vw]">
            Let's Build Together
          </p>
          <p className="uppercase items-start font-merriweather text-center text-[#0D0800] py-8">
            We're not just a product—We're a Movement 
          </p>
          <p className="uppercase items-start font-merriweather text-center text-[#0D0800] py-8">
            Join us as a user, supporter, or collaborator to help shape the future of skilled work.
          </p>
          <button className="bg-[#262208] text-[#FCF8E3] self-center uppercase sm:w-[25%] md:w-[20%] lg:w-[15%] shadow-sm rounded-sm p-4">
            PARTNER WITH US
          </button>
        </div>
      </div>
    </main>
  );
};

export default HomePage;