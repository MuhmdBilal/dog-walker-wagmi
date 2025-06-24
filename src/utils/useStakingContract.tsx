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
import { stakingAddress, stakingAbi } from "@/contract/staking";
type StakeData = [bigint, bigint];
type UserPoolInfo = [bigint, bigint];
export const useGetUserPoolInfo = () => {
  const { address } = useAccount();

  const { data, refetch } = useReadContract({
    address: stakingAddress,
    abi: stakingAbi,
    functionName: "getUserPoolInfo",
    args: address ? [address] : undefined,
  }) as {
    data: UserPoolInfo | undefined;
    refetch: () => void;
  };

  return {
    pctOfPool: data && data[1] > BigInt(0) ? Number(data[1]) / 1e18 : 0,
    pctOfPoolRefetch: refetch,
  };
};

export const useGetStakeData = () => {
  const { address } = useAccount();
  const { data: getStakeData = [BigInt(0), BigInt(0)], refetch } =
    useReadContract({
      address: stakingAddress,
      abi: stakingAbi,
      functionName: "getStakeData",
      args: address ? [address] : undefined,
    }) as { data: StakeData; refetch: () => void };

  return {
    totalStaked:
      getStakeData && getStakeData[0] > BigInt(0)
        ? Number(getStakeData[0]) / 1e18
        : 0,
    totalStakedRefetch: refetch,
  };
};

export const useHasMinimumPurchased = () => {
  const { address } = useAccount();
  const { data: hasMinimumPurchased, refetch } = useReadContract({
    address: stakingAddress,
    abi: stakingAbi,
    functionName: "hasMinimumPurchased",
    args: address ? [address] : undefined,
  });

  return {
    hasMinimumPurchased: hasMinimumPurchased,
    hasMinimumPurchasedRefetch: refetch,
  };
};

export const useStaking = () => {
  const {
    writeContract,
    data: hash,
    isPending: isStakingPending,
    isSuccess: isStakinhSuccess,
  } = useWriteContract();

  const {
    isLoading: txStakingLoading,
    isSuccess: txStakingSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({ hash });

  const buyStaking = ({ value }: { value: any }) => {
    if (!value) return;
    writeContract({
      address: stakingAddress,
      abi: stakingAbi,
      functionName: "stake",
      args: [value],
    });
  };

  return {
    buyStaking,
    isStakingPending,
    isStakinhSuccess,
    txStakingLoading,
    txStakingSuccess,
    txError,
  };
};
