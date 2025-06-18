import Image from "next/image";

interface Step {
  number: string;
  title: string;
  description: string;
  imageSrc: string;
}

const HowHiringWorks = () => {
  const steps: Step[] = [
    {
      number: "#1",
      title: "Set Up Your Profile",
      description: "Create a profile that highlights your craft and experience.",
      imageSrc: "/ejl1.svg"
    },
    {
      number: "#2",
      title: "Explore Job Listings",
      description: "Create a profile that highlights your craft and experience.",
      imageSrc: "/ejl.svg"
    },
    {
      number: "#3",
      title: "Get Hired",
      description: "Clients review applications and select the right artisan.",
      imageSrc: "/ejl2.svg"
    },
    {
      number: "#4",
      title: "Deliver & Earn",
      description: "Do the work, get approved, and receive secure payment.",
      imageSrc: "/ejl3.svg"
    }
  ];

  return (
    <section 
      className="py-20 px-8 lg:px-16"
      style={{ backgroundColor: '#333333' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400">
            Get started in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg"
              style={{ backgroundColor: '#F2E8CF0A' }}
            >
              <div className="space-y-6">
                {/* Step Number */}
                <span className="text-5xl lg:text-6xl font-bold text-gray-600">
                  {step.number}
                </span>
                
                {/* Step Title */}
                <h3 className="text-2xl lg:text-3xl font-bold text-white">
                  {step.title}
                </h3>
                
                {/* Step Description */}
                <p className="text-lg text-gray-400">
                  {step.description}
                </p>
                
                {/* Step Image */}
                <div className="relative h-[300px] lg:h-[350px] bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  <Image
                    src={step.imageSrc}
                    alt={`Step ${index + 1}: ${step.title}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowHiringWorks;