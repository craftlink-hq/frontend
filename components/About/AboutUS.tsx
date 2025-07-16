"use client";
import HeroSection from '@/components/About/Hero';
import Section from '@/components/About/Section';
import CoreValues from '@/components/About/CoreValues';
import Image from 'next/image';
import {Community, FooterLinks} from "@/components/LandingPage";
import { socials } from "@/utils/socials";
import Link from "next/link";

const HomePage = () => {
  
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        headline="We connect skilled hands to paying clients."
        description="More than a platform, we are a growing network of skilled hands, creative minds, and forward-thinkers—united by the goal to work, earn, and grow without limits."
        imageSrc="/hand.svg"
        imageAlt="Skilled craftsman hands at work"
      />

      {/* Mission Section */}
      <Section
        title="MISSION"
        content={
          <>
            <p>To empower skilled artisans by connecting them with the right clients through a seamless, job marketplace.</p>
            <p>We strive to make it easy for artisans to get discovered, get hired, and get paid securely and fairly.</p>
            <p>By removing barriers and streamlining access to opportunities, we&apos;re building a trusted ecosystem where talent meets demand—from fashion designers and carpenters to tech freelancers, tailors e.t.c.</p>
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
            <p>We&apos;re making the informal economy more powerful, one job at a time.</p>
            <p>By removing barriers and streamlining access to opportunities, we&apos;re building a trusted ecosystem where talent meets demand—from fashion designers and carpenters to tech freelancers, tailors e.t.c.</p>
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
          <div className="flex flex-col justify-center relative bg-[#FFD700] items-center md:w-[90%] min-h-[45vh] h-fit w-[95vw] rounded-md py-12 my-4 space-y-8">
            <Image
              src="/bg-blend.png"
              alt="background blend"
              fill
              className="z-20 opacity-70 mix-blend-overlay"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <h2 className="text-[#0D0800] font-alata text-[32px] sm:text-[40px] md:text-[4vw] text-center w-[90%] md:w-[70%] leading-[38px] sm:leading-[48px] md:leading-[60px] lg:leading-[4vw] z-30">
              Let Us Build Together
            </h2>
            <div className="text-center space-y-6 px-4 z-30">
              <p className="font-bold font-merriweather text-[#0D0800] text-[18px] sm:text-[20px] md:text-[22px] leading-relaxed">
                We are not just a product, We are a Movement.
              </p>
              <p className="font-merriweather text-[#0D0800] text-[16px] sm:text-[18px] md:text-[20px] leading-relaxed max-w-[600px] mx-auto">
                Join us as a user, supporter, or collaborator to help shape the future of skilled work.
              </p>
            </div>
            <button className="bg-[#262208] text-[#FCF8E3] uppercase w-[60%] sm:w-[200px] md:w-[220px] lg:w-[240px] shadow-sm rounded-sm py-4 px-8 text-[14px] sm:text-[16px] font-medium z-30 hover:bg-[#1a1506] transition-colors">
              GET STARTED
            </button>
          </div>
        </div>

      <Community/>

      <footer
        id="resources"
        className="flex md:bg-faq flex-col lg:flex-row gap-y-8 gap-x-4 py-4 lg:px-16 lg:p-4 lg:h-[50vh] justify-center items-center rounded-md"
      >
        {/* Left container */}
        <div className="bg-footer flex-grow w-[90vw] md:w-[90%] lg:w-[35%] h-full justify-center lg:h-[90%] border-[1px] p-8 border-[#FCFBF726] rounded-lg">
          <div className="flex md:px-2 gap-x-2 items-center font-mooli">
            <Image src="/logo.png" alt="CraftLink logo" width={22} height={49} />
            <span className="text-[20px] md:text-[28px]">
              Craft{""}
              <span className="bg-[#FFD700] text-[#1A1203] rounded-sm">Link</span>
            </span>
          </div>
          <div className="grid md:flex lg:flex-col md:justify-between h-full lg:h-[90%] items-start text-start gap-x-8">
            <p className="py-4 md:self-end lg:self-start font-merriweather md:w-[25%] lg:w-[65%] xl:w-[50%] text-[#FCFDFF] text-[20px]">
              Empower Your Craft, Connect with Clients.
            </p>
            <div className="flex gap-x-4 justify-center items-center lg:self-center border-[0.74px] border-[#FFFFFF40] rounded-xl drop-shadow-md md:h-[70px] h-[85px] w-fit md:max-w-[30vw] lg:min-w-[25vw] xl:min-w-[40%]  px-[5px] md:px-[1vw]">
              {socials.map((social) => (
                <Link  href={social.link} key={social.socialsType}>
                  <Image
                    alt={social.socialsType}
                    src={social.imageSrc}
                    width="45"
                    height="45"
                    className="bg-[#FFD7001A] rounded-md p-[0.5vw]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      
        {/* Right container */}
        <div className="flex flex-col flex-grow w-[90vw] md:w-[90%] h-full gap-y-2 lg:h-[90%]">
          <div className="grid grid-cols-2 lg:flex bg-footer gap-y-4 max-lg:items-center justify-center lg:justify-between border-[1px] lg:h-[70%] p-8 border-[#FCFBF726] rounded-lg">
            <FooterLinks />
          </div>
          <div className="bg-footer flex font-merriweather items-center px-4 text-[#9A9992] text-sm justify-between h-24 lg:h-[30%] rounded-lg border-[1px] border-[#FCFBF726]">
            <span>All rights reserved</span>
            <span>© Copyright 2024</span>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default HomePage;