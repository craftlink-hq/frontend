import { useCallback, useState } from "react";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { toast } from "sonner";
import { isSupportedChain } from "@/constants/chain";

export const useSubmitReview = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);

  const submitReview = useCallback(
    async (databaseId: string, rating: number, commentHash: string) => {
      if (!isConnected || !address) {
        toast.warning("Please connect your wallet first.");
        return;
      }
      if (!isSupportedChain(chainId)) {
        toast.warning("Unsupported network. Please switch to the correct network.");
        return;
      }
      if (!databaseId || rating < 1 || rating > 5 || !commentHash) {
        toast.error("Invalid review data");
        return;
      }

      setIsLoading(true);
      try {
        const functionName = "submitReview";
        const params = { databaseId, rating, commentHash };
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
          toast.success("Review submitted successfully");
        } else {
          toast.error(`Error: ${result.message}`);
        }
      } catch (error: unknown) {
        if ((error as Error).message.includes("User rejected")) {
          toast.info("Signature request cancelled");
        } else {
          toast.error("Error during review submission");
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [address, isConnected, chainId, signMessageAsync]
  );

  return { submitReview, isLoading };
};