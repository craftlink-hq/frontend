"use client";

import { useChainSwitch } from "@/hooks/useChainSwitch";
import { useActiveAccount } from "thirdweb/react";

const ChainSwitcher = () => {
  const account = useActiveAccount();
  const { isOnCorrectChain, switchToBaseSepolia, currentChainId } = useChainSwitch();

  if (!account) return null;

  if (isOnCorrectChain) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Connected to Base Sepolia
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-yellow-700">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        Wrong network (Chain ID: {currentChainId})
      </div>
      <button
        onClick={switchToBaseSepolia}
        className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
      >
        Switch to Base Sepolia
      </button>
    </div>
  );
};

export default ChainSwitcher;