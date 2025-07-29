"use client";

import Image from "next/image";
import Link from "next/link";
import { MdOutlineMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { useState } from "react";
// import Button from "../Button";
import AnimatedDiv from "@/components/AnimatedDiv";
import { useRouter } from "next/navigation";
import ConnectWallet from "../ConnectWallet";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const router = useRouter();

  // Menu items array (updated to route-based navigation)
  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/features", label: "Features" },
    { href: "/marketplace", label: "Visit Marketplace" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const handleLogin = () => {
  //   router.push("/role/artisans/signin");
  // };

  return (
    <div>
      <div className="bg-header w-screen bg-opacity-100 flex justify-between border-b-[0.5px] border-[#FCFBF726] shadow-lg px-4 md:px-8 items-center py-4 font-merriweather">
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
              <span className="text-[20px] md:text-[28px]">
                Craft
                <span className="bg-[#FFD700] text-[#1A1203] rounded-sm">
                  Link
                </span>
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex gap-x-8 text-lg text-[#F9F1E2]">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-[#FFD700]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Sign In Button */}
        <div className="hidden lg:flex">
          {/* <Button onClick={handleLogin} text="Sign In" /> */}
          <ConnectWallet
            label="Sign In"
            onConnect={() => router.push("/role/artisans/signin")}
          />
        </div>

        {/* Mobile Menu Icon */}
        <div className="flex lg:hidden">
          <MdOutlineMenu color="#FFD700" size={32} onClick={toggleMenu} />
        </div>
      </div>

      {/* Mobile Menu Slide-In */}
      {isMenuOpen && (
        <div className="fixed h-[100vh] w-screen  bg-[#4E4E4E] bg-opacity-10 backdrop-blur-[1.9px] inset-0 z-30 lg:hidden">
          {/* Blurred Background Overlay */}
          <AnimatedDiv 
            initialX="100%"
            animateX={0} 
            exitX="100%"
            duration={0.3}
            className="absolute top-0  w-[70vw] h-[70vh] right-0 bg-[#333333] z-50 lg:hidden"
          >
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center px-4 py-4 border-b border-[#FCFBF726]">
              {/* Mobile Menu Logo */}
              <div className="flex gap-x-2 items-center font-mooli">
                <Image
                  src="/logo.png"
                  alt="CraftLink logo"
                  width={18}
                  height={39}
                />
                <span className="text-[18px] text-[#F9F1E2]">
                  Craft{""}
                  <span className="bg-[#FFD700] text-[#1A1203] rounded-sm px-1">
                    Link{""}
                  </span>
                </span>
              </div>
              {/* Close Button */}
              <button
                onClick={toggleMenu}
                className="text-[#F9F1E2] rounded-full p-2 bg-[#3B3A39] hover:text-[#FFD700] transition-colors"
                aria-label="Close menu"
              >
                <IoClose size={24} color={"#E5D1D1"} />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col jusyify-between">
              {/* Navigation Items */}
              <div className="flex-1 flex flex-col px-6 py-8 space-y-8">
                {menuItems.slice(1).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    className="text-[#B5B4AD] hover:text-[#F9F1E2] text-lg font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Sign In Button */}
              <div className="px-4 py-8">
                <ConnectWallet
                  label="Sign In"
                  onConnect={() => {
                    router.push("/role/artisans/signin");
                    toggleMenu();
                  }}
                />
                {/* <button
                  onClick={() => {
                    handleLogin();
                    toggleMenu();
                  }}
                  className="w-full bg-[#FFD700] text-[#1A1203]  py-[12px] px-6 rounded-lg text-lg uppercase hover:bg-[#FFD700]/90 transition-colors"
                >
                  Sign In
                </button> */}
              </div>
            </div>
          </AnimatedDiv>
        </div>
      )}
    </div>
  );
};

export default Header;
