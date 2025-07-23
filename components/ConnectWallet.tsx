"use client";

import { thirdwebClient, wallets } from "@/app/client";
import { useEffect, useState } from "react";
import { ConnectButton, darkTheme, useActiveAccount } from "thirdweb/react";
import type { Account } from "thirdweb/wallets";

interface ConnectWalletProps {
  onConnect?: () => void;
  label?: string;
}


const ConnectWallet = ({ onConnect, label = "Connect Wallet" }: ConnectWalletProps) => {
  const [mounted, setMounted] = useState(false);
   const account = useActiveAccount();
  const [prevAccount, setPrevAccount] = useState<Account | undefined>(undefined);

  const origin =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://craftlinkhq.com";
  const metadata = {
    name: "craftLink",
    description: "The Future of Decentralized Commerce",
    url: origin,
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (account && !prevAccount && onConnect) {
      onConnect();
    }
    setPrevAccount(account);
  }, [account, prevAccount, onConnect]);

  if (!mounted) return null;

  return (
    <div>
      <div className="hidden md:flex">
        {/* <appkit-button balance="hide" /> */}
        <ConnectButton 
          client={thirdwebClient}
          appMetadata={metadata}
          connectButton={{label}}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "#FFD700",
            },
          })}
        />
      </div>
      <div className="md:hidden flex">
        {/* <appkit-button label="Connect" balance="hide" /> */}
        <ConnectButton 
          client={thirdwebClient}
          appMetadata={metadata}
          connectButton={{label}}
          wallets={wallets}
          connectModal={{ size: "compact" }}
          theme={darkTheme({
            colors: {
              primaryButtonBg: "#FFD700",
            },
          })}
        />
      </div>
     
    </div>
  );
};
export default ConnectWallet;
