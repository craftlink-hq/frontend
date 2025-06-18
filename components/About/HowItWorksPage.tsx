// pages/index.js (or app/page.js for Next.js 13+)
import { useRouter } from 'next/router';
import HeroSection from '@/components/About/Hero';
import CoreValues from '@/components/About/CoreValues';
import HowHiringWorks from '@/components/About/HowHiringWorks';

const HowItWorksPage = () => {
  const router = useRouter();
  return (
    <main>
      {/* Hero Section */}
      <HeroSection
        headline="We connect skilled hands to paying clients."
        description="More than a platform, we are a growing network of skilled hands, creative minds, and forward-thinkers—united by the goal to work, earn, and grow without limits."
        imageSrc="/howIt.png"
        imageAlt="Skilled craftsman hands at work"
        buttonText="Visit Marketplace"
        onButtonClick={() => router.push('/marketplace')}
      />


      {/* Core Values Section */}
      <CoreValues />
      <HowHiringWorks />
    </main>
  );
};

export default HowItWorksPage;