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

  return {
    usdtValueWei: data,
    usdtValueEth: data ? Number(data) / 1e18 : 0,
    isUsdtLoading: isPending,
    isUsdtError: isError,
  };
};

export const useUserSpentUSD = () => {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError, refetch } = useReadContract({
    abi: icoAbi,
    address: icoAddress,
    functionName: "userSpentUSD",
    args: [address],
    query: {
      enabled: isConnected && !!address,
    },
  });

  return {
    userSpentUSD: data ? Number(data)/1e18: 0,
    isLoading,
    isError,
    userSpentUSDRefetch : refetch
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

export const useTokenSoldBalance = () => {
  const {
    data: balanceTokensSold,
    isLoading: isLoadingTokenSold,
    error,
    refetch,
    isFetching,
  } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "tokensSold",
    args: [],
  });

  return {
    tokenSOldBalance: balanceTokensSold ? Number(balanceTokensSold) / 1e18 : 0,
    isLoadingTokenSold,
    error,
    refetchTokenSold: refetch,
    isFetchingTokenSold: isFetching,
  };
};

export const useIcoRemainingBalance = () => {
  const {
    data: balanceIcoRemainingB,
    isLoading: isLoadingIcoRemaining,
    error,
    refetch,
    isFetching,
  } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "icoRemaining",
    args: [],
  });

  return {
    icoRemainingBalance: balanceIcoRemainingB
      ? Number(balanceIcoRemainingB) / 1e18
      : 0,
    isLoadingIcoRemaining,
    error,
    refetchIcoRemaining: refetch,
    isFetchingIcoRemaining: isFetching,
  };
};

export const useGetCurrentPrice = () => {
  const { data: currentPrice } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "getCurrentPrice",
    args: [],
  });

  return {
    currentPrice: currentPrice ? Number(currentPrice) / 1e18 : 0,
  };
};

export const useCurrentRoundPrice = () => {
  const { data: currentRound } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "currentRound",
    args: [],
  });

  return {
    currentRound:  Number(currentRound)
  };
};


export const useTotalRaisedUSD = () => {
  const { data: totalRaisedUSD } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "totalRaisedUSD",
    args: [],
  });

  return {
    totalRaisedUSD: totalRaisedUSD?  Number(totalRaisedUSD) / 1e18: 0
  };
};

export const useMaxPaise = () => {
  const { data: maxPaise } = useReadContract({
    address: icoAddress,
    abi: icoAbi,
    functionName: "MAX_RAISE",
    args: [],
  });

  return {
    maxPaise: maxPaise?  Number(maxPaise) / 1e18: 0
  };
};