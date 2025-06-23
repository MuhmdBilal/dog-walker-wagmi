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
import { usdtAbi, usdtAddress } from "@/contract/usdt";
import { icoAddress } from "@/contract/ico";

export const useUsdtApproval = ({ amountToSpend }: { amountToSpend: any }) => {
  const { address } = useAccount();
  const {
    data: allowance,
    refetch: refetchAllowance,
    isLoading: allowanceLoading,
    isError: allowanceError,
  } = useReadContract({
    abi: usdtAbi,
    address: usdtAddress,
    functionName: "allowance",
    args: [address, icoAddress],
    // enabled: !!address,
  });

  // 2️⃣ Prepare write for approve()
  const {
    writeContract,
    data: txApprovalHash,
    isPending: isApproving,
    isSuccess: writeSuccess,
  } = useWriteContract();

  const approveUSDT = () => {
    if (!amountToSpend || !address) return;
    writeContract({
      abi: usdtAbi,
      address: usdtAddress,
      functionName: "approve",
      args: [icoAddress, amountToSpend],
    });
  };

  // 3️⃣ Wait for approve tx to confirm
  const { isLoading: approvalTxLoading, isSuccess: approvalConfirmed } =
    useWaitForTransactionReceipt({ hash: txApprovalHash });
  if (approvalConfirmed) {
    refetchAllowance?.();
  }

  return {
    allowance,
    allowanceLoading,
    allowanceError,
    approveUSDT,
    refetchAllowance,
    approvalTxLoading,
    approvalConfirmed,
    isApproving,
    writeSuccess,
    txApprovalHash,
  };
};



export const useUSDTBalanceOf = () => {
  const { address } = useAccount();
  const { data: balanceOf } = useReadContract({
    abi: usdtAbi,
      address: usdtAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    usdtBalanceOf: balanceOf?  Number(balanceOf) / 1e18: 0
  };
};