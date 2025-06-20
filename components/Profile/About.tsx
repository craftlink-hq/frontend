import { useRouter } from "next/navigation";
import Bio from "@/components/Profile/Bio";
import Details from "@/components/Profile/Details";
import Skills from "@/components/Profile/Skills";
import Image from "next/image";
import { ArtisanProfileProps } from "@/utils/profile";

const About = ({profile}: {profile: ArtisanProfileProps} ) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/role/artisans/onboarding/bio");
  };

  return (
    <div className="flex font-merriweather text-[#F9F1E2] p-4 md:p-8 bg-[#F2E8CF0A] rounded-lg gap-y-8 md:gap-y-4 flex-col ">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl">About</h3>
        <button
          onClick={handleEdit}
          className="bg-[#262208] rounded-full flex items-center px-[10px] py-[6px] gap-x-2 hover:bg-[#262208]/80 transition-colors"
        >
          Edit{""}
          <span className="relative h-[28px] w-[28px] rounded-full bg-[#F2E8CF0A]">
            <Image
              src="/edit.png"
              alt="pen"
              fill
              className="object-contain p-2"
            />
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 w-full md:grid-rows-1 ">
        <div className="md:col-span-1  h-full ">
          <Bio about={profile.about} />
        </div>
        <div className="md:col-span-1 flex flex-col gap-y-2 h-full ">
          <div className="h-full">
            {" "}
            <Details details={profile.details} />
          </div>
          <div className="h-full">
            {" "}
            <Skills skills={profile.skills} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
