import Image from "next/image";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";

const Header = () => {
  return (
    <div className="bg-header w-screen flex justify-between border-b-[0.5px] border-[#FCFBF726] shadow-lg px-4 md:px-8 items-center py-4  font-merriweather">
      <Link href="/">
        <div className="flex md:px-2 gap-x-4 items-center font-mooli">
          {/* Mobile Logo */}
          <div className="md:hidden bg-yellow rounded-md px-4 py-2">
            <Image
              src="/dark-logo.svg"
              alt="CraftLink logo"
              width={24}
              height={24}
            />
          </div>
          {/* Desktop Logo */}
          <div className="hidden md:flex gap-x-4 items-center">
            <Image
              src="/logo.png"
              alt="CraftLink logo"
              width={22}
              height={49}
            />
            <span className="text-[20px] text-[#F9F1E2] md:text-[28px]">
              Craft
              <span className="bg-[#FFD700] text-[#1A1203] rounded-sm">
                Link
              </span>
            </span>
          </div>
        </div>
      </Link>
      <ConnectWallet />
    </div>
  );
};

export default Header;
