"use client";
import Image from "next/image";
import ConnectWallet from "../ConnectWallet";
import Link from "next/link";
import { links } from "@/utils/links";
import { MdOutlineMenu } from "react-icons/md";
import { useState } from "react";
import { useGetUserRole } from "@/utils/store";
import { IoClose } from "react-icons/io5";
import AnimatedDiv from "@/components/AnimatedDiv";
import useCheckDualRole from "@/hooks/Registry/useCheckDualRole";
import {
  FiUser,
  FiHelpCircle,
  FiBell,
  FiSettings,
  FiFileText,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useAccount } from "@/lib/thirdweb-hooks";


interface Header {
  isActive: (path: string) => boolean;
}

const ProfileHeader = ({ isActive }: Header) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewProfileExpanded, setIsViewProfileExpanded] = useState(false);
  const { address } = useAccount();
  const { hasDualRole } = useCheckDualRole(address || "");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { role, setRole } = useGetUserRole();
  const isArtisan = role === "artisan";
  const isClient = role === "client";

  const handleRoleSwitch = (newRole: "artisan" | "client") => {
    setRole(newRole);
    setIsViewProfileExpanded(false);
    setIsMenuOpen(false);
  };

  // Get profile page based on role
  const getProfilePage = (selectedRole?: "artisan" | "client") => {
    const targetRole = selectedRole || role;
    if (targetRole === "artisan") return "/profile/artisans";
    if (targetRole === "client") return "/profile/clients";
    return "/";
  };

  const menuItems = [
    { href: links.browseJob, label: "Browse Jobs" },
    { href: isArtisan ? links.applied : links.opened, label: "Manage Jobs" },
    { href: links.message, label: "Messages" },
    { href: links.resources, label: "Resources" },
  ];

  return (
    <div className="bg-[#333333] bg-opacity-[98%] bg-header z-10 ">
      <div className=" flex w-screen justify-between border-b-[0.5px] border-[#FCFBF726] p-4 lg:px-8 items-center   gap-x-4 xl:gap-x-8 font-merriweather">
        <Link href="/">
          <div className="md:hidden bg-yellow rounded-md px-4 py-2">
            <Image
              src="/dark-logo.svg"
              alt="CraftLink logo"
              width={24}
              height={24}
            />
          </div>
          <div className="hidden md:flex gap-x-4  w-full items-center font-mooli">
            <Image
              src="/logo.svg"
              alt="CraftLink logo"
              width={161}
              height={41}
            />
          </div>
        </Link>
        <div className=" gap-x-4 xl:gap-x-8 lg:w-[50%] justify-center  hidden lg:flex  text-[#B5B4AD]">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <p
                className={`${
                  isActive(item.href)
                    ? "text-yellow font-bold"
                    : "hover:text-yellow"
                }`}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </div>
  
        <div className="flex gap-x-4">
          <ConnectWallet />
          <div className="flex md:hidden">
            <MdOutlineMenu color={"#F9F1E2"} size={32} onClick={toggleMenu} />
          </div>
        </div>
        {isMenuOpen && (
          <div className="fixed h-[100vh] w-screen  bg-[#4E4E4E] bg-opacity-10 backdrop-blur-[1.9px] inset-0 z-30 lg:hidden">
            {/* Blurred Background Overlay */}
            <AnimatedDiv
              initialX="100%"
              animateX={0}
              exitX="100%"
              duration={0.3}
              className="absolute top-0  w-[70vw] h-fit pb-4 right-0 bg-[#333333] z-50 lg:hidden"
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
              <div className="flex flex-col justify-between border-b border-[#FCFBF726]">
                {/* Navigation Items */}
                <div className=" flex flex-col px-6 py-8 space-y-8">
                  {menuItems.map((item) => (
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
              </div>
              {(isArtisan || isClient) && (
                <>
                  {hasDualRole ? (
                    <>
                      <button
                        onClick={() =>
                          setIsViewProfileExpanded(!isViewProfileExpanded)
                        }
                        className="flex items-center justify-between w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                      >
                        <div className="flex items-center space-x-3 py-2">
                          <FiUser className="w-4 h-4" />
                          <span>Your Profile</span>
                        </div>
                        {/* Dropdown Icon */}
                        {isViewProfileExpanded ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {/* Expanded role options with navigation */}
                      {isViewProfileExpanded && (
                        <>
                          <Link href={getProfilePage("artisan")}>
                            <button
                              onClick={() => handleRoleSwitch("artisan")}
                              className={`flex items-center justify-between w-full text-left px-6 py-3 text-white hover:bg-[#444444] transition-colors ${
                                isArtisan ? "bg-[#444444] text-[#FFD700]" : ""
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <FiUser className="w-4 h-4" />
                                <span>Artisan</span>
                              </div>
                              {isArtisan && (
                                <span className="text-green-500 text-xs italic">
                                  Active
                                </span>
                              )}
                            </button>
                          </Link>
                          <Link href={getProfilePage("client")}>
                            <button
                              onClick={() => handleRoleSwitch("client")}
                              className={`flex items-center justify-between w-full text-left px-6 py-3 text-white hover:bg-[#444444] transition-colors ${
                                isClient ? "bg-[#444444] text-[#FFD700]" : ""
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <FiUser className="w-4 h-4" />
                                <span>Client</span>
                              </div>
                              {isClient && (
                                <span className="text-green-500 text-xs italic">
                                  Active
                                </span>
                              )}
                            </button>
                          </Link>
                        </>
                      )}
                    </>
                  ) : (
                    // Single role users get direct link to their profile page
                    <Link href={getProfilePage()}>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                    </Link>
                  )}
                  <div className="border-t border-[#555555] my-2"></div>
                </>
              )}

              {/* Existing Filter Options */}
              <button
                onClick={() => {
                  console.log("Selected: Help & FAQs");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
              >
                <FiHelpCircle className="w-4 h-4" />
                <span>Help & FAQs</span>
              </button>
              <button
                onClick={() => {
                  console.log("Selected: Notification");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
              >
                <FiBell className="w-4 h-4" />
                <span>Notification</span>
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-auto">
                  1
                </span>
              </button>
              <button
                onClick={() => {
                  console.log("Selected: Settings");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  console.log("Selected: Terms and Policies");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
              >
                <FiFileText className="w-4 h-4" />
                <span>Terms and Policies</span>
              </button>
              <button
                onClick={() => {
                  console.log("Selected: Disconnect Wallet");
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                <span>Disconnect Wallet</span>
              </button>

              {/* Bottom Connect Wallet Button */}
              <div className="border-t border-[#555555] mt-2 pt-2 px-4">
                <div onClick={() => setIsMenuOpen(false)}>
                  <ConnectWallet />
                </div>
              </div>
            </AnimatedDiv>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
