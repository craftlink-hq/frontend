import type { Metadata } from "next";
import "./globals.css";
import { Mooli, Merriweather, Alata } from "next/font/google";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import { FilterStateProvider } from "@/context/filter";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

const mooli = Mooli({
  subsets: ["latin"],
  weight: ["400"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const alata = Alata({
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CraftLink",
  description: "The home of artisans and their clients",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const cookies = (await headers()).get("cookie");

  return (
    <html lang="en">
      <body
        className={`${mooli.className} ${alata.className} ${merriweather.className} antialiased`}
      >
        <ThirdwebProvider>
          <Toaster />
          <AnimatedWrapper>
            {/* <ContextProvider cookies={cookies}> */}
              <FilterStateProvider>{children}</FilterStateProvider>
            {/* </ContextProvider> */}
          </AnimatedWrapper>
        </ThirdwebProvider>
      </body>
    </html>
  );
}
