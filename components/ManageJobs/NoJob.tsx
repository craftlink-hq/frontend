import Image from "next/image";
import { useGetUserRole } from "@/utils/store";
import Link from "next/link";

interface NoJobProps {
  title: string;
  desc: string;
  imageSrc: string;
  jobType: string;
}

const NoJob = ({ title, desc, imageSrc, jobType }: NoJobProps) => {
  const { role } = useGetUserRole();

  // Determine content based on user type
  const getContent = () => {
    if (role === "artisan") {
      return {
        buttonText: "BROWSE JOBS",
        href: "/marketplaace"
      };
    } else {
       return {
        buttonText: "POST JOB",
        href: "/role/clients/create-job/title"
      };
    }
  };

  const content = getContent();

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#F2E8CF0A' }}
    >
      <div className="grid font-merriweather text-[#F9F1E2] text-center py-4 md:py-8 lg:py-16 gap-y-8 justify-self-center w-[80%] md:w-[70%] lg:w-[40%] items-center">
        <div className="place-self-center relative h-[50vh] w-[70%]">
          <Image
            src={imageSrc}
            alt="No job"
            fill
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
          {/* Faint yellow line under the image */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-px opacity-30"
            style={{ backgroundColor: '#FFD700', top: '100%', marginTop: '1rem' }}
          ></div>
        </div>
        <span>
          <p className="font-bold text-2xl">{title}</p>
           <p>{desc}</p>
        </span>
        
        

        {jobType !== "disputed" && (
          <Link href={content.href}>
          <button 
            className="justify-self-center md:w-[40%] rounded-md text-[#1A1203] px-4 py-2 font-bold font-merriweather hover:opacity-90 transition-opacity duration-200"
            style={{ backgroundColor: '#FFD700' }}
          >
            {content.buttonText}
          </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default NoJob;