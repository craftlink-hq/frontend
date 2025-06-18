"use client";

import { useCallback } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { isSupportedChain } from "@/constants/chain";
import { useLoading } from "../useLoading";
import { start } from "repl";

export const useMint = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { isLoading, startLoading, stopLoading } = useLoading();

  const mint = useCallback(async () => {
    if (!isConnected || !address) {
      toast.warning("Please connect your wallet first.");
      return;
    }
    if (!isSupportedChain(chainId)) {
      toast.warning("Unsupported network. Please switch to the correct network.");
      return;
    }

    startLoading();
    try {
      const functionName = "mint";
      const params = {};
      const gaslessMessage = JSON.stringify({ functionName, user: address, params });
      const gaslessSignature = await signMessageAsync({ message: gaslessMessage });

      const response = await fetch("http://localhost:3005/gasless-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          functionName,
          user: address,
          params,
          signature: gaslessSignature,
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("CraftCoin minted successfully");
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error: unknown) {
      if ((error as Error).message.includes("User rejected")) {
        toast.info("Signature request cancelled");
      } else {
        toast.error("Error during minting");
        console.error(error);
      }
    } finally {
      stopLoading();
    }
  }, [address, isConnected, chainId, signMessageAsync]);

  return { mint, isLoading };
};