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
import { dwtTokenAddress, dwtTokenAbi } from "@/contract/dwtToken";
import { stakingAddress } from "@/contract/staking";

export const useDwtBalanceOf = () => {
  const { address } = useAccount();
  const { data: balanceOf, refetch } = useReadContract({
    address: dwtTokenAddress,
    abi: dwtTokenAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });
  
  return {
    dwtBalanceOf: balanceOf ? Number(balanceOf) / 1e18 : 0,
    dwtBalanceOfToWei: balanceOf,
    dwtTokenRefetch: refetch,
  };
};

export const useAllowance = () => {
  const { address } = useAccount();
  const { data: dwtAllowance, refetch } = useReadContract({
    address: dwtTokenAddress,
    abi: dwtTokenAbi,
    functionName: "allowance",
    args: address ? [address, stakingAddress] : undefined,
  });

  return {
    dwtAllowance: dwtAllowance ? Number(dwtAllowance) / 1e18 : 0,
    dwtRefetch: refetch,
  };
};

export const useDwtApproval = ({ amountToSpend }: { amountToSpend: any }) => {
  const { address } = useAccount();

  const {
    writeContract,
    data: dwtApprovalHash,
    isPending: isDwtApproving,
    isSuccess: writeDwtSuccess,
  } = useWriteContract();

  const approveDwt = () => {
    if (!amountToSpend || !address) return;
    writeContract({
      address: dwtTokenAddress,
      abi: dwtTokenAbi,
      functionName: "approve",
      args: [stakingAddress, amountToSpend],
    });
  };

  const { isLoading: approvalDwtLoading, isSuccess: approvalDwtConfirmed } =
    useWaitForTransactionReceipt({ hash: dwtApprovalHash });

  return {
    approveDwt,
    approvalDwtLoading,
    approvalDwtConfirmed,
    isDwtApproving,
    writeDwtSuccess,
    dwtApprovalHash,
  };
};
