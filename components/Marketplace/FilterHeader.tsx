"use client";
import { useEffect, useState, useRef } from 'react';
import Image from "next/image";
import ConnectWallet from "../ConnectWallet";
import SearchBar from "../SearchBar";
import Link from "next/link";
import { links } from "@/utils/links";
import { AccountCard } from "@/utils/profile";
import { toast } from "sonner";
import useIsArtisan from '@/hooks/Registry/useIsArtisan';
import useIsClient from '@/hooks/Registry/useIsClient';
import { 
  FiUser, 
  FiMenu, 
  FiHelpCircle, 
  FiBell, 
  FiSettings, 
  FiFileText 
} from 'react-icons/fi';

interface Header {
  isActive: (path: string) => boolean;
}

const MarketplaceHeader = ({ isActive }: Header) => {
  const [userCard, setUserCard] = useState<AccountCard | null>(null);
  const [isClientsDropdownOpen, setIsClientsDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const clientsDropdownRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  
  const isArtisan = useIsArtisan();
  const isClient = useIsClient();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientsDropdownRef.current && !clientsDropdownRef.current.contains(event.target as Node)) {
        setIsClientsDropdownOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menu items array
  const menuItems = [
    { href: links.browseJob, label: "Browse Jobs" },
    { href: links.applied, label: "Manage Jobs" },
    { href: links.message, label: "Messages" },
    { href: links.resources, label: "Resources" },
  ];

  useEffect(() => {
    const determineUserRole = async () => {
      try {
        // Set the user card based on role
        if (isArtisan) {
          setUserCard({
            type: "artisan",
            image: "/profile.png", // You might want to fetch this from IPFS
            profilePage: "/profile/artisans",
          });
        } else if (isClient) {
          setUserCard({
            type: "client",
            image: "/profile.png", // You might want to fetch this from IPFS
            profilePage: "/profile/clients",
          });
        } else {
          setUserCard(null);
        }
      } catch (error) {
        console.error("Error determining user role:", error);
        toast.error("Error loading profile");
        setUserCard(null);
      }
    };

    determineUserRole();
  }, [isArtisan, isClient]);

  return (
    <div className="bg-[#333333] bg-opacity-[98%] bg-header z-10">
      <div className="flex w-full justify-between items-center px-4 lg:px-8 2xl:px-16 py-3 h-20 font-merriweather">
        {/* Logo */}
        <Link href="/">
          <div className="flex gap-x-2 items-center font-mooli">
            <Image
              src="/logo.png"
              alt="CraftLink logo"
              width={18}
              height={40}
            />
            <span className="text-[20px] md:text-[24px] text-white">
              Craft{""}
              <span className="bg-[#FFD700] text-[#1A1203] px-1 rounded-sm">
                Link
              </span>
            </span>
          </div>
        </Link>

        {/* Center Navigation Menu */}
        <div className="flex gap-x-8 items-center text-white" style={{ fontFamily: 'Merriweather', fontWeight: 400, fontSize: '16px', lineHeight: '120%', letterSpacing: '0%' }}>
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
        
        <div className="flex gap-x-3 items-center">
          {/* Search Bar */}
          <SearchBar />

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center space-x-1 bg-[#444444] hover:bg-[#555555] text-white px-3 py-2 rounded transition-colors"
            >
              <span>Filter</span>
            </button>

            {/* Filter Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-[#333333] rounded-lg shadow-lg border border-[#555555] py-2 z-50">
                <button
                  onClick={() => {
                    console.log('Selected: Help & FAQs');
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                >
                  <FiHelpCircle className="w-4 h-4" />
                  <span>Help & FAQs</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Selected: Notification');
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                >
                  <FiBell className="w-4 h-4" />
                  <span>Notification</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Selected: Settings');
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    console.log('Selected: Terms and Policies');
                    setIsFilterOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full text-left px-4 py-3 text-white hover:bg-[#444444] hover:text-[#FFD700] transition-colors"
                >
                  <FiFileText className="w-4 h-4" />
                  <span>Terms and Policies</span>
                </button>
                
                {/* Bottom Sign In Button */}
                <div className="border-t border-[#555555] mt-2 pt-2 px-4">
                  <Link href="/register">
                    <button className="w-full bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1203] font-semibold py-2 rounded transition-colors">
                      SIGN IN
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Conditional Authentication Section */}
          {!isArtisan && !isClient ? (
            // Visitors - Show Sign In Button
            <Link href="/register">
              <button className="bg-[#FFD700] hover:bg-[#E6C200] text-[#1A1203] font-semibold px-4 py-2 rounded text-sm transition-colors">
                SIGN IN
              </button>
            </Link>
          ) : (
            // Artisans & Clients - Show Connect Wallet and Profile
            <>
              <ConnectWallet />
              {userCard && (
                <div className="relative rounded-full h-8 w-8">
                  <Link href={userCard.profilePage}>
                    <Image
                      src={userCard.image}
                      alt="Profile pic"
                      fill
                      style={{ objectFit: "contain", objectPosition: "center" }}
                    />
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Profile Icon (for when no userCard) */}
          {(isArtisan || isClient) && !userCard && (
            <div className="relative" ref={profileDropdownRef}>
              <button className="p-2 border border-[#555555] rounded hover:bg-[#444444] transition-colors">
                <FiUser className="w-4 h-4 text-white" />
              </button>
            </div>
          )}

          {/* Hamburger Menu */}
          <button className="p-2 hover:bg-[#444444] rounded transition-colors">
            <FiMenu className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHeader;