import Image from "next/image";
import Link from "next/link";

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
      imageSrc: "/ejl1.svg",
    },
    {
      number: "#2",
      title: "Explore Job Listings",
      description: "Create a profile that highlights your craft and experience.",
      imageSrc: "/ejl.svg",
    },
    {
      number: "#3",
      title: "Get Hired",
      description: "Clients review applications and select the right artisan.",
      imageSrc: "/ejl2.svg",
    },
    {
      number: "#4",
      title: "Deliver & Earn",
      description: "Do the work, get approved, and receive secure payment.",
      imageSrc: "/ejl3.svg",
    },
  ];

  return (
    <section className="py-20 px-8 lg:px-16" style={{ backgroundColor: "#333333" }}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title and Sign In Button */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16 gap-6">
          <h2
            className="text-4xl lg:text-5xl font-bold text-white text-center lg:text-left"
            style={{ fontFamily: "Alata, sans-serif" }}
          >
            The process is made easy
          </h2>
          <Link
            href="/register"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-3 px-6 rounded-md transition-all"
          >
            SIGN IN
          </Link>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {steps.map((step, index) => (
            <div
              key={index}
              className="p-4 rounded-lg w-full"
              style={{
                backgroundColor: "#F2E8CF0A",
                minHeight: "400px",
              }}
            >
              <div className="space-y-4">
                {/* Step Number */}
                <span
                  className="text-4xl lg:text-5xl font-bold"
                  style={{ color: "#F2E8CF29" }}
                >
                  {step.number}
                </span>

                {/* Step Title */}
                <h3
                  className="text-2xl lg:text-3xl font-bold text-white"
                  style={{ fontFamily: "Alata, sans-serif" }}
                >
                  {step.title}
                </h3>

                {/* Step Description */}
                <p
                  className="text-base"
                  style={{
                    color: "#F2E8CF29",
                    fontFamily: "Merriweather, serif",
                  }}
                >
                  {step.description}
                </p>

                {/* Step Image */}
                <div className="relative h-[200px] lg:h-[250px] bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
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
