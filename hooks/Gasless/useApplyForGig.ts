"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { ethers, formatEther } from "ethers";
import { useRouter } from "next/navigation";
import { getCraftCoinContract, getGigContract } from "@/constants/contracts";
import { useLoading } from "../useLoading";
import { useAccount, useChainId, useSignMessage, useSignTypedData } from "@/lib/thirdweb-hooks";
import { useChainSwitch } from "../useChainSwitch";

const useApplyForGig = () => {
  const { account } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { signTypedDataAsync } = useSignTypedData();
  const router = useRouter();
  const { isLoading, startLoading, stopLoading } = useLoading();
  const RELAYER_URL = process.env.RELAYER_URL;
  const { ensureCorrectChain } = useChainSwitch();

  const applyForGig = useCallback(
    async (databaseId: string) => {
      if (!account) {
        toast.warning("Please connect your wallet first.");
        return false;
      }
      const isCorrectChain = await ensureCorrectChain();
      if (!isCorrectChain) {
        return false;
      }

      startLoading();
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://rpc.sepolia.lisk.com"
        );

        // Fetch required CFT for the gig
        const gigContract = getGigContract(provider);
        const requiredCFT = await gigContract.getRequiredCFT(databaseId);
        const formattedCFT = Number(formatEther(requiredCFT));

        // Fetch user's CFT balance
        const craftCoinContract = getCraftCoinContract(provider);
        const cftResp = await craftCoinContract.balanceOf(account?.address);
        const cftBalance = Number(formatEther(cftResp));

        if (cftBalance < formattedCFT) {
          toast.error("Insufficient CFT balance to apply for this gig.");
          return;
        }

        // Fetch user's info from CraftCoin contract
        const nonce = await craftCoinContract.nonces(account?.address);
        const name = await craftCoinContract.name();
        const version = await craftCoinContract.version?.() ?? "1";

        // Set deadline (1 hour from now)
        const deadline = Math.floor(Date.now() / 1000) + 3600;

        const typedData = {
          domain: {
            name: name,
            version: version,
            chainId: chainId,
            verifyingContract: process.env.NEXT_PUBLIC_CRAFT_COIN as string,
          },
          types: {
            Permit: [
              { name: "owner", type: "address" },
              { name: "spender", type: "address" },
              { name: "value", type: "uint256" },
              { name: "nonce", type: "uint256" },
              { name: "deadline", type: "uint256" },
            ],
          },
          primaryType: "Permit",
          message: {
            owner: account?.address,
            spender: process.env.NEXT_PUBLIC_GIG_MARKET_PLACE,
            value: requiredCFT.toString(),
            nonce: nonce.toString(),
            deadline: deadline.toString(),
          }
        };

        // Sign permit message using custom hook
        const permitSignature = await signTypedDataAsync(typedData);

        // Split permit signature into v, r, s
        const signature = ethers.Signature.from(permitSignature);
        const { v, r, s } = signature;

        // Prepare params for the gasless transaction
        const params = {
          databaseId,
          deadline: deadline.toString(),
          v,
          r,
          s,
        };

        // Prepare gasless transaction message
        const functionName = "applyForGig";
        const gaslessMessage = JSON.stringify({ functionName, user: account?.address, params });

        // Sign the gasless transaction message using custom hook
        const gaslessSignature = await signMessageAsync(gaslessMessage);

        // Send request to the relayer backend
        if (!RELAYER_URL) {
          throw new Error("Relayer URL is not defined");
        }
        const response = await fetch(`${RELAYER_URL}/gasless-transaction`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            functionName,
            user: account?.address,
            params,
            signature: gaslessSignature,
          }),
        });

        const result = await response.json();
        if (result.success) {
          toast.success("Application Submitted");
          router.push("/manage-jobs/artisans");
        } else {
          toast.error(`Error: ${result.message}`);
        }

        return true;
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
        } else {
          toast.error("Error during application");
          console.error(error);
        }

        return false;
      } finally {
        stopLoading();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [account, chainId, signMessageAsync, signTypedDataAsync, router]
  );

  return { applyForGig, isLoading };
};

export default useApplyForGig;