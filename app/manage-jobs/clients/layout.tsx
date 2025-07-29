"use client";
import MarketHeader from "@/components/Marketplace/MarketHeader";
import { links } from "@/utils/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import useGetTokenBalance from "@/hooks/Token/useGetTokenBalance";
import useGetClientAmountSpent from "@/hooks/PaymentProcessor/useGetClientAmountSpent";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const tokenBalance = useGetTokenBalance();
  const checkAmountSpent = useGetClientAmountSpent();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    { href: links.opened, label: "Open" },
    { href: links.client_active, label: "Active" },
    { href: links.client_completed, label: "Completed" },
    { href: links.client_disputed, label: "Disputed" },
    { href: links.client_closed, label: "Closed" },
  ];


  return (
    <div className="flex flex-col bg-[url('/bg.png')] min-h-screen w-screen bg-opacity-[25%]">
      <div className="flex flex-col bg-[#333333] bg-opacity-[95%] min-h-screen ">
        <div className="min-h-screen">
          <div className="flex gap-y-4 flex-col w-screen h-full pb-8">
            <MarketHeader isActive={isActive} />
            <div className="w-[90%] self-center flex flex-col md:flex-row justify-between gap-6 md:gap-4">
              <div className="self-center py-4 md:py-0">
                <h2 className="text-[#FCFBF7] md:text-2xl font-bold mb-3 md:mb-0 text-2xl">
                  <span className="border-b-2 border-yellow"> MANAGE </span>JOBS
                </h2>
                <span className="md:w-[20%] font-merriweather text-[#F9F1E2] text-lg md:text-base block md:inline">
                  Track applications, submit completed work, and resolve
                  disputes in one place.
                </span>
                </div>
                <div className="bg-[#F2E8CF0A] border border-[#FCFBF726] rounded-lg p-6 md:p-4 md:px-8 w-full md:w-auto md:min-w-[400px] min-h-[140px] md:min-h-auto">
                  <div className="flex items-center gap-2 mb-3 md:mb-1">
                    <Image
                      src={"/wallet.png"}
                      alt={"coin"}
                      width="20"
                      height="20"
                      className="md:w-[18px] md:h-[18px]"
                    />{" "}
                    <h2 className="text-xl md:text-base text-[#F9F1E2]">Earnings</h2>
                  </div>
                  <p className="text-base md:text-sm text-[#D8D6CF] mb-4 md:mb-2">
                    Your earnings, in tokens. withdraw when you&apos;re ready.
                  </p>

                  <div className="flex justify-between p-4 md:p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <div className="w-3 h-3 bg-[#04DF76] rounded-full"></div>
                        <span className="text-base md:text-sm text-[#B5B4AD]">
                          Available
                        </span>
                      </div>
                      <div className="text-2xl md:text-2xl font-bold text-[#FFCC6D] font-alata">
                        {tokenBalance} <span className="text-lg md:text-lg">USDT</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <div className="w-3 h-3 bg-[#47F9FF] rounded-full"></div>
                        <span className="text-base md:text-sm text-[#B5B4AD]">
                          Total Spent
                        </span>
                      </div>
                      <div className="text-2xl md:text-2xl font-bold text-[#FFCC6D] font-alata">
                        {checkAmountSpent} <span className="text-lg md:text-lg">USDT</span>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div className="w-[90%] self-center bg-[#F2E8CF0A] h-[70%] rounded-lg">
              <div className="border-b-[0.5px] px-4 border-[#FCFBF726] flex justify-between text-lg text-[#B5B4AD] py-[16px] max-sm:gap-x-8 max-sm:overflow-x-scroll md:w-full shadow-md self-center">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <p
                      className={`${
                        isActive(item.href)
                          ? "bg-[#262208] rounded-md px-16"
                          : "hover:text-yellow px-8"
                      } py-2`}
                    >
                      {item.label} <span className="max-sm:hidden">Jobs</span>
                    </p>
                  </Link>
                ))}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}