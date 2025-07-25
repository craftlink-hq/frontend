"use client"
import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import ConnectWallet from "../ConnectWallet"
import SearchBar from "../SearchBar"
import Link from "next/link"
import { links } from "@/utils/links"
import useCheckDualRole from "@/hooks/Registry/useCheckDualRole";
import { FiUser, FiMenu, FiHelpCircle, FiBell, FiSettings, FiFileText, FiChevronDown, FiChevronUp, FiX} from "react-icons/fi"

import { useGetUserRole } from "@/utils/store";
import { useAccount } from "@/lib/thirdweb-hooks";

interface Header {
  isActive: (path: string) => boolean
}

const MarketplaceHeader = ({ isActive }: Header) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isViewProfileExpanded, setIsViewProfileExpanded] = useState(false)

  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const { address } = useAccount();
  const { role, setRole } = useGetUserRole();
  const { hasDualRole } = useCheckDualRole(address || "");
  
  const isArtisan = role === "artisan";
  const isClient = role === "client";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
        setIsViewProfileExpanded(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Menu items array
  const menuItems = [
    { href: links.browseJob, label: "Browse Jobs" },
    { href: isArtisan ? links.applied : links.opened, label: "Manage Jobs" },
    { href: links.message, label: "Messages" },
    { href: links.resources, label: "Resources" },
  ]

  // Handle role switching
  const handleRoleSwitch = (newRole: "artisan" | "client") => {
    setRole(newRole);
    setIsViewProfileExpanded(false);
    setIsMobileMenuOpen(false);
  }

  // Get user role text for display
  const getUserRoleText = () => {
    if (isArtisan) return "Artisan"
    if (isClient) return "Client"
    return "Visitor"
  }

  // Get user image based on role
  const getUserImage = () => {
    if (isArtisan) return "/profile.png" 
    if (isClient) return "/profile.png" 
    return "/placeholder.svg" 
  }

  // Get profile page based on role
  const getProfilePage = (selectedRole?: "artisan" | "client") => {
    const targetRole = selectedRole || role;
    if (targetRole === "artisan") return "/profile/artisans"
    if (targetRole === "client") return "/profile/clients"
    return "/"
  }

  // Check if user has a valid role
  const hasValidRole = isArtisan || isClient

  return (
    <div className="bg-[#333333] bg-opacity-[98%] bg-header z-10">
      <div className="flex w-full justify-between items-center px-4 lg:px-8 2xl:px-16 py-3 h-16 lg:h-20 font-merriweather">
        {/* Logo */}
        <Link href="/">
          <div className="flex gap-x-2 items-center font-mooli">
            <Image src="/logo.png" alt="CraftLink logo" width={18} height={40} />
            <span className="text-[18px] lg:text-[20px] xl:text-[24px] text-white">
              Craft{""}
              <span className="bg-[#FFD700] text-[#1A1203] px-1 rounded-sm">Link</span>
            </span>
          </div>
        </Link>

        {/* Center Navigation Menu - Hidden on mobile */}
        <div
          className="hidden lg:flex gap-x-8 items-center text-white"
          style={{
            fontFamily: "Merriweather",
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "120%",
            letterSpacing: "0%",
          }}
        >
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <p
                className={`${
                  isActive(item.href)
                    ? "border-b-2 border-[#FFD700] pb-1"
                    : "hover:border-b-2 hover:border-[#FFD700] hover:pb-1"
                } transition-all duration-300 ease-in-out cursor-pointer`}
              >
                {item.label}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex gap-x-2 lg:gap-x-3 items-center">
          {/* Search Bar - Hidden on small screens */}
          <div className="hidden md:block lg:hidden xl:block">
            <SearchBar />
          </div>

          <div className="bg-[#26220840] rounded-lg px-2 lg:px-3 py-2">
            <div className="flex gap-x-2 lg:gap-x-3 items-center">
              {/* Conditional Authentication Section */}
            {!isArtisan && !isClient ? (
              // Visitors
              <Link href="/role/artisans/signin">
                <button className="bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1203] font-semibold px-3 lg:px-4 py-2 rounded text-sm transition-colors">
                  SIGN IN
                </button>
              </Link>
            ) : (
              // Artisans & Clients
              <>
                <div className="hidden lg:block">
                  <ConnectWallet />
                </div>
                {hasValidRole ? (
                  <div className="flex flex-col items-center">
                    <div className="rounded-full h-6 w-6 lg:h-8 lg:w-8 overflow-hidden">
                      <Image
                        src={getUserImage()}
                        alt="Profile pic"
                        width={32}
                        height={32}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    {/* Role Text Below Profile Image */}
                    <span className="text-white text-[10px] lg:text-xs font-medium mt-1 text-center">
                      {getUserRoleText()}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Fallback Profile Section for users without profile image - No dropdown functionality */}
                    <div className="p-1.5 lg:p-2 border border-[#555555] rounded">
                      <FiUser className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    </div>
                    {/* Role Text Below Profile Icon */}
                    <span className="text-white text-[10px] lg:text-xs font-medium mt-1 text-center">
                      {getUserRoleText()}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button - Now contains profile options + existing items */}
            <div className="relative" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 lg:p-2 hover:bg-[#444444] rounded transition-colors"
              >
                <FiMenu className="w-4 h-4 text-white" />
              </button>

              {/* Mobile Menu Dropdown - Full screen overlay on mobile */}
              {isMobileMenuOpen && (
                <>
                  {/* Mobile Overlay */}
                  <div className="fixed inset-0 bg-[#333333] z-50 lg:hidden">
                    <div className="flex flex-col h-full">
                      {/* Header with logo and close button */}
                      <div className="flex justify-between items-center p-4 border-b border-[#555555]">
                        <div className="flex gap-x-2 items-center font-mooli">
                          <Image src="/logo.png" alt="CraftLink logo" width={18} height={40} />
                          <span className="text-[18px] text-white">
                            Craft{""}
                            <span className="bg-[#FFD700] text-[#1A1203] px-1 rounded-sm">Link</span>
                          </span>
                        </div>
                        <button
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 hover:bg-[#444444] rounded transition-colors"
                        >
                          <FiX className="w-5 h-5 text-white" />
                        </button>
                      </div>

                      {/* Menu Content */}
                      <div className="flex-1 px-4 py-6">
                        <div className="space-y-1">
                          {/* Your Profile Section - Expandable for dual role users */}
                          {(isArtisan || isClient) && (
                            <>
                              {hasDualRole ? (
                                <>
                                  <button
                                    onClick={() => setIsViewProfileExpanded(!isViewProfileExpanded)}
                                    className="flex items-center justify-between w-full text-left px-4 py-4 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors rounded"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FiUser className="w-5 h-5" />
                                      <span className="text-base">Your Profile</span>
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
                                    <div className="ml-4 space-y-1">
                                      <Link href={getProfilePage("artisan")}>
                                        <button
                                          onClick={() => handleRoleSwitch("artisan")}
                                          className={`flex items-center justify-between w-full text-left px-4 py-3 text-white hover:bg-[#444444] transition-colors rounded ${
                                            isArtisan ? 'bg-[#444444] text-[#FFD700]' : ''
                                          }`}
                                        >
                                          <div className="flex items-center space-x-3">
                                            <FiUser className="w-4 h-4" />
                                            <span>Artisan</span>
                                          </div>
                                          {isArtisan && <span className="text-green-500 text-xs italic">Active</span>}
                                        </button>
                                      </Link>
                                      <Link href={getProfilePage("client")}>
                                        <button
                                          onClick={() => handleRoleSwitch("client")}
                                          className={`flex items-center justify-between w-full text-left px-4 py-3 text-white hover:bg-[#444444] transition-colors rounded ${
                                            isClient ? 'bg-[#444444] text-[#FFD700]' : ''
                                          }`}
                                        >
                                          <div className="flex items-center space-x-3">
                                            <FiUser className="w-4 h-4" />
                                            <span>Client</span>
                                          </div>
                                          {isClient && <span className="text-green-500 text-xs italic">Active</span>}
                                        </button>
                                      </Link>
                                    </div>
                                  )}
                                </>
                              ) : (
                                // Single role users get direct link to their profile page
                                <Link href={getProfilePage()}>
                                  <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 w-full text-left px-4 py-4 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors rounded"
                                  >
                                    <FiUser className="w-5 h-5" />
                                    <span className="text-base">View Profile</span>
                                  </button>
                                </Link>
                              )}
                            </>
                          )}

                          {/* Menu Items */}
                          <button
                            onClick={() => {
                              console.log("Selected: Help & FAQs")
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 w-full text-left px-4 py-4 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors rounded"
                          >
                            <FiHelpCircle className="w-5 h-5" />
                            <span className="text-base">Help & FAQs</span>
                          </button>
                          <button
                            onClick={() => {
                              console.log("Selected: Notification")
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center justify-between w-full text-left px-4 py-4 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors rounded"
                          >
                            <div className="flex items-center space-x-3">
                              <FiBell className="w-5 h-5" />
                              <span className="text-base">Notification</span>
                            </div>
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">1</span>
                          </button>
                          <button
                            onClick={() => {
                              console.log("Selected: Settings")
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 w-full text-left px-4 py-4 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors rounded"
                          >
                            <FiSettings className="w-5 h-5" />
                            <span className="text-base">Settings</span>
                          </button>
                          <button
                            onClick={() => {
                              console.log("Selected: Terms and Policies")
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 w-full text-left px-4 py-4 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors rounded"
                          >
                            <FiFileText className="w-5 h-5" />
                            <span className="text-base">Terms and Policies</span>
                          </button>
                        </div>
                      </div>

                      {/* Bottom Sign In Button */}
                      <div className="p-4 border-t border-[#555555]">
                        <Link href="/role/artisans/signin">
                          <button 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1203] font-semibold py-4 rounded text-base transition-colors"
                          >
                            SIGN IN
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Menu Dropdown - Keep original */}
                  <div className="hidden lg:block absolute top-full right-0 mt-1 w-56 bg-[#333333] rounded-lg shadow-lg border border-[#555555] py-2 z-50">
                    {/* Search Bar for tablet */}
                    <div className="px-4 py-2 xl:hidden">
                      <SearchBar />
                    </div>
                    <div className="border-t border-[#555555] mt-2 pt-2 xl:hidden"></div>
                    
                    {/* Your Profile Section - Expandable for dual role users */}
                    {(isArtisan || isClient) && (
                      <>
                        {hasDualRole ? (
                          <>
                            <button
                              onClick={() => setIsViewProfileExpanded(!isViewProfileExpanded)}
                              className="flex items-center justify-between w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                            >
                              <div className="flex items-center space-x-3">
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
                                      isArtisan ? 'bg-[#444444] text-[#FFD700]' : ''
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FiUser className="w-4 h-4" />
                                      <span>Artisan</span>
                                    </div>
                                    {isArtisan && <span className="text-green-500 text-xs italic">Active</span>}
                                  </button>
                                </Link>
                                <Link href={getProfilePage("client")}>
                                  <button
                                    onClick={() => handleRoleSwitch("client")}
                                    className={`flex items-center justify-between w-full text-left px-6 py-3 text-white hover:bg-[#444444] transition-colors ${
                                      isClient ? 'bg-[#444444] text-[#FFD700]' : ''
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <FiUser className="w-4 h-4" />
                                      <span>Client</span>
                                    </div>
                                    {isClient && <span className="text-green-500 text-xs italic">Active</span>}
                                  </button>
                                </Link>
                              </>
                            )}
                          </>
                        ) : (
                          // Single role users get direct link to their profile page
                          <Link href={getProfilePage()}>
                            <button
                              onClick={() => setIsMobileMenuOpen(false)}
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
                        console.log("Selected: Help & FAQs")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                    >
                      <FiHelpCircle className="w-4 h-4" />
                      <span>Help & FAQs</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Selected: Notification")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                    >
                      <FiBell className="w-4 h-4" />
                      <span>Notification</span>
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-auto">1</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Selected: Settings")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                    >
                      <FiSettings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Selected: Terms and Policies")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                    >
                      <FiFileText className="w-4 h-4" />
                      <span>Terms and Policies</span>
                    </button>
                    <button
                      onClick={() => {
                        console.log("Selected: Disconnect Wallet")
                        setIsMobileMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                    >
                      <FiSettings className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>

                    {/* Bottom Connect Wallet Button */}
                    <div className="border-t border-[#555555] mt-2 pt-2 px-4">
                      <div onClick={() => setIsMobileMenuOpen(false)}>
                        <ConnectWallet />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
                      </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketplaceHeader