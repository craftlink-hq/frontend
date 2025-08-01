import Image from "next/image";
import { ArtisanProfileProps } from "@/utils/profile";
import { toast } from "sonner";

interface Details {
  detailValue: string | boolean;
  imgSrc: string;
}

const AccountCard = ({ artisan }: { artisan: ArtisanProfileProps }) => {
  const details: Details[] = [
    {
      imgSrc: "/language.svg",
      detailValue: artisan.details.language,
    },
    {
      imgSrc: "/money.svg",
      detailValue: `$${artisan.details.minimumProjectAmount / 1e6}/Project`,
    },
    {
      imgSrc: "/location.svg",
      detailValue: artisan.details.location,
    },
    {
      imgSrc: "/calendar.svg",
      detailValue: (artisan.details.availability ? "Available" : "Not Available") + " To Work",
    },
    {
      imgSrc: "/expertise.svg",
      detailValue: artisan.details.experience,
    },
  ];

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/artisans/${artisan.details.walletAddress}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success("Profile URL copied to clipboard!");
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(artisan.details.walletAddress).then(() => {
      toast.success("Wallet address copied to clipboard!");
    });
  };

  return (
    <div className="flex max-w-full font-merriweather text-[#F9F1E2] bg-profile border border-[#FCFBF726] rounded-lg  gap-x-4 justify-between">
      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-8">
        <span className="h-72 w-84 md:w-72 md:h-full relative">
          {" "}
          <Image
            src={artisan.about.avatar}
            alt="avatar"
            fill
            className="object-cover rounded-xl"
          />
        </span>
        <div className="flex flex-col py-4 gap-y-2">
          <div className="font-alata font-bold text-lg xl:text-[35px] text-[#FCF8F0] uppercase flex max-sm:gap-x-2">
            #{artisan.about.username}{" "}
          </div>

          <span className="text-lg xl:text-2xl font-bold text-[#FCF8F0] flex items-center gap-x-2">
            {artisan.about.jobTitle}{" "}
            <span className="flex text-[#F0FCF6] self-end text-xs md:text-sm px-2  py-[3px] bg-[#04DF7621] border rounded-full border-[#04DF76]">
              Verified
            </span>
          </span>
          <div className=" py-2 font-merriweather w-full self-start grid grid-cols-2 auto-cols-auto  gap-2">
            {details.map((detail, index) => (
              <div
                key={detail.imgSrc}
                className={`flex gap-2 p-2 ${index === details.length - 1 && details.length % 2 !== 0
                  ? "col-span-2"
                  : ""
                  }`}
              >
                <div className="flex gap-x-2 self-center relative h-[22px] w-[22px]">
                  <Image
                    src={detail.imgSrc}
                    alt={detail.imgSrc}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="capitalize  self-center text-start text-[#F9F1E2]">
                  {detail.detailValue}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            <button onClick={handleShareProfile} className="  w-fit py-2 px-4 uppercase  bg-[#262208] rounded-md text-[#FCF8E3] font-bold text-sm md:text-base">
              Share Profile
            </button></div>
        </div>

      </div>
      <div className="hidden lg:flex flex-col justify-between">
        <div className="flex self-end gap-x-2 p-8">
          <p className="text-xl font-bold text-[#D8D6CF]">
            {artisan.details.walletAddress.slice(0, 6)}...
            {artisan.details.walletAddress.slice(-5)}
          </p>
          <button className="flex gap-x-2 items-center text-[#E0D8A8]" onClick={handleCopy}>
            <span className="relative border border-[#F9F1E240]  rounded-full h-[32px] w-[32px] ">
              <Image
                src={"/save.png"}
                alt="save"
                fill
                className="object-contain p-[6px]"
              />
            </span>{" "}
          </button>
        </div>
        <div className="hidden lg:flex relative  self-end items-end justify-end  h-[23vh] w-[25vw]">
          <Image
            src={"/client-artisan.png"}
            alt="Profile status"
            fill
            style={{ objectFit: "contain", objectPosition: "right bottom" }}
            className="opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountCard;
