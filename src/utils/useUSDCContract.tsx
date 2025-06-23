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
import { usdcAbi, usdcAddress } from "@/contract/usdc";
import { icoAddress } from "@/contract/ico";



export const useUsdcApproval = ({ amountToSpend }: { amountToSpend: any }) => {
  const { address } = useAccount();
  const {
    data: usdcAllowance,
    refetch: refetchAllowance,
    isLoading: allowanceLoading,
    isError: allowanceError,
  } = useReadContract({
    abi: usdcAbi,
    address: usdcAddress,
    functionName: "allowance",
    args: [address, icoAddress],
    // enabled: !!address,
  });
  const {
    writeContract,
    data: txApprovalHash,
    isPending: isUSDCApproving,
    isSuccess: writeSuccess,
  } = useWriteContract();

  const approveUSDC = () => {
    if (!amountToSpend || !address) return;
    writeContract({
      abi: usdcAbi,
    address: usdcAddress,
      functionName: "approve",
      args: [icoAddress, amountToSpend],
    });
  };

  // 3️⃣ Wait for approve tx to confirm
  const { isLoading: approvalTxLoading, isSuccess: approvalUsdcConfirmed } =
    useWaitForTransactionReceipt({ hash: txApprovalHash });
  if (approvalUsdcConfirmed) {
    refetchAllowance?.();
  }

  return {
    usdcAllowance,
    allowanceLoading,
    allowanceError,
    approveUSDC,
    refetchAllowance,
    approvalTxLoading,
    approvalUsdcConfirmed,
    isUSDCApproving,
    writeSuccess,
    txApprovalHash,
  };
};


export const useUSDCBalanceOf = () => {
  const { address } = useAccount();
  const { data: balanceOf } = useReadContract({
    abi: usdcAbi,
    address: usdcAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  return {
    usdcBalanceOf: balanceOf?  Number(balanceOf) / 1e18: 0
  };
};