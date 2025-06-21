import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
} from "wagmi";
import { useAccount, useConfig } from "wagmi";
import { estimateGas } from "wagmi/actions";
import { parseUnits } from "viem";
import { parseEther } from "viem";
import { icoAbi, icoAddress } from "@/contract/ico";

export const usePreviewBNB = (tokenAmount: any) => {
  const enabled =
    !!tokenAmount && !isNaN(Number(tokenAmount)) && Number(tokenAmount) > 0;

  const { data, isPending, isError } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "previewBNB",
    args: enabled ? [parseUnits(tokenAmount.toString(), 18)] : undefined,
    query: {
      enabled,
    },
  });

  return {
    bnbValueWei: data, // raw wei
    bnbValueEth: data ? Number(data) / 1e18 : 0,
    isLoading: isPending,
    isError,
  };
};
export const usePreviewUSDC = (tokenAmount: any) => {
  const enabled =
    !!tokenAmount && !isNaN(Number(tokenAmount)) && Number(tokenAmount) > 0;
  const { data, isPending, isError } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "previewUSDC",
    args: enabled ? [parseUnits(tokenAmount.toString(), 18)] : undefined,
    query: {
      enabled,
    },
  });
  return {
    usdcValueWei: data,
    usdcValueEth: data ? Number(data) / 1e18 : 0,
    isUsdcLoading: isPending,
    isUsdcError: isError,
  };
};

export const usePreviewUSDT = (tokenAmount: any) => {
  const enabled =
    !!tokenAmount && !isNaN(Number(tokenAmount)) && Number(tokenAmount) > 0;
  const { data, isPending, isError } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "previewUSDT",
    args: enabled ? [parseUnits(tokenAmount.toString(), 18)] : undefined,
    query: {
      enabled,
    },
  });
  // console.log("data". data);

  return {
    usdtValueWei: data,
    usdtValueEth: data ? Number(data) / 1e18 : 0,
    isUsdtLoading: isPending,
    isUsdtError: isError,
  };
};

export const useReferrer = () => {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError } = useReadContract({
    abi: icoAbi,
    address: icoAddress,
    functionName: "referrerOf",
    args: [address],
    query: {
      enabled: isConnected && !!address,
    },
  });

  return {
    referrer: data,
    isLoading,
    isError,
  };
};

export const useBnbTokenPurchase = () => {
  const {
    writeContract,
    data: hash,
    isPending,
    isSuccess,
  } = useWriteContract();

  const {
    isLoading: txLoading,
    isSuccess: txBNBSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({ hash });

  const buyTokenWithBnb = ({
    value,
    asset,
    referrer,
    bnbValueWei,
  }: {
    value: any;
    asset: any;
    referrer: any;
    bnbValueWei: any;
  }) => {
    try {
      const tokenAmountWithDecimals = parseUnits(value.toString(), 18); // returns bigint
      const weiValueCal = parseUnits("0.000001", 18); // returns bigint
      const calculateValue = bnbValueWei + weiValueCal;

      writeContract({
        address: icoAddress,
        abi: icoAbi,
        functionName: "buyTokens",
        args: [tokenAmountWithDecimals, asset, referrer],
        value: calculateValue,
      });
    } catch (error) {
      console.error("❌ Error in buyTokenWithBnb:", error);
      alert(error);
    }
  };

  return {
    buyTokenWithBnb,
    isPending,
    isSuccess,
    txLoading,
    txBNBSuccess,
    txError,
  };
};

export const useBuyTokensWithUSDT = () => {
  const {
    writeContract,
    data: hash,
    isPending: isUSDTPending,
    isSuccess: isUSDTSuccess,
  } = useWriteContract();

  const {
    isLoading: txUSDTLoading,
    isSuccess: txUSDTSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({ hash });

  const buyTokensWithUSDT = ({
    value,
    asset,
    referrer,
  }: {
    value: any;
    asset: any;
    referrer: any;
  }) => {
    if (!value) return;

    const tokenAmountWithDecimals = parseUnits(value.toString(), 18);
    writeContract({
      address: icoAddress,
      abi: icoAbi,
      functionName: "buyTokens",
      args: [tokenAmountWithDecimals, asset, referrer],
      value: BigInt(0),
    });
  };

  return {
    buyTokensWithUSDT,
    isUSDTPending,
    isUSDTSuccess,
    txUSDTLoading,
    txUSDTSuccess,
    txError,
  };
};

export const useBuyTokensWithUSDC = () => {
  const {
    writeContract,
    data: hash,
    isPending: isUSDCPending,
    isSuccess: isUSDCSuccess,
  } = useWriteContract();

  const {
    isLoading: txUSDCLoading,
    isSuccess: txUSDCSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({ hash });

  const buyTokensWithUSDC = ({
    value,
    asset,
    referrer,
  }: {
    value: any;
    asset: any;
    referrer: any;
  }) => {
    if (!value) return;

    const tokenAmountWithDecimals = parseUnits(value.toString(), 18);
    writeContract({
      address: icoAddress,
      abi: icoAbi,
      functionName: "buyTokens",
      args: [tokenAmountWithDecimals, asset, referrer],
      value: BigInt(0),
    });
  };

  return {
    buyTokensWithUSDC,
    isUSDCPending,
    isUSDCSuccess,
    txUSDCLoading,
    txUSDCSuccess,
    txError,
  };
};
