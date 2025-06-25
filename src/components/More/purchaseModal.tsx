"use client";
import React, { useEffect, useState, useMemo, use } from "react";
// import { Web3Provider } from '@ethersproject/providers';
// import { useWalletClient } from 'wagmi';
import styles from "./LayoutClient.module.scss";
import { useAccount, useWalletClient } from "wagmi";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import {
  useBnbTokenPurchase,
  useBuyTokensWithUSDC,
  useBuyTokensWithUSDT,
  useIcoRemainingBalance,
  usePreviewBNB,
  usePreviewUSDC,
  usePreviewUSDT,
  useTokenSoldBalance,
  useUserSpentUSD,
} from "@/utils/useIcoContract";
import { useUsdtApproval, useUSDTBalanceOf } from "@/utils/useUSDTContract";
import { useUsdcApproval, useUSDCBalanceOf } from "@/utils/useUSDCContract";
import { useDwtBalanceOf } from "@/utils/useDwtContact";
import { useHasMinimumPurchased } from "@/utils/useStakingContract";
interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  setShowModal: any;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  setShowModal,
  //   detailValue,
  //   getValueByAddress,
  //   referAddres,
}) => {
  const [asset, setAsset] = useState<any>("");
  const [isMobile, setIsMobile] = useState(false);
  const [hash, setHash] = useState<any>(null);
  const [dwtAmount, setDwtAmount] = useState("");
  const [referrerAddress, setReferrerAddress] = useState<any>("");
  const { isConnected, address } = useAccount();
  const [payableAmountFromWei, setPayableAmountFromWei] = useState<any>("");
  const [payableAmount, setPayableAmount] = useState<any>("");
  const [ownerAddress, setOwnerAddress] = useState<any>("");
  const [calculateValue, setCalculateValue] = useState<any>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();
  const resetForm = () => {
    setDwtAmount("");
    setAsset("");
    // setReferrerAddress("");
    setPayableAmountFromWei("");
    setPayableAmount("");
    setShowModal(false);
  };
  const bnbEnabled = asset == 0 && !!dwtAmount;
  const usdcEnabled = asset == 1 && !!dwtAmount;
  const usdtEnabled = asset == 2 && !!dwtAmount;
  const { bnbValueEth, bnbValueWei } = usePreviewBNB(
    bnbEnabled ? dwtAmount : null
  );
  const { usdcValueEth, usdcValueWei } = usePreviewUSDC(
    usdcEnabled ? dwtAmount : null
  );

  const { usdtValueEth, usdtValueWei } = usePreviewUSDT(
    usdtEnabled ? dwtAmount : null
  );
  const { refetchTokenSold } = useTokenSoldBalance();
  const { refetchIcoRemaining } = useIcoRemainingBalance();
  const { usdcBalanceOf } = useUSDCBalanceOf();
  const { usdtBalanceOf } = useUSDTBalanceOf();
  const { dwtTokenRefetch } = useDwtBalanceOf();
  const {hasMinimumPurchasedRefetch} =useHasMinimumPurchased()
  const {userSpentUSDRefetch} = useUserSpentUSD()
  const { allowance, approveUSDT, approvalConfirmed, isApproving } =
    useUsdtApproval({ amountToSpend: usdtValueWei });
  const { usdcAllowance, approveUSDC, approvalUsdcConfirmed, isUSDCApproving } =
    useUsdcApproval({ amountToSpend: usdcValueWei });
  const { buyTokensWithUSDT, txUSDTLoading, txUSDTSuccess, isUSDTPending } =
    useBuyTokensWithUSDT();
  const {
    buyTokensWithUSDC,
    isUSDCPending,
    isUSDCSuccess,
    txUSDCLoading,
    txUSDCSuccess,
  } = useBuyTokensWithUSDC();
  const { buyTokenWithBnb, txLoading, txBNBSuccess, isPending } =
    useBnbTokenPurchase();
  const handleWrite = async () => {
    if (!dwtAmount) {
      setError(true);
      return;
    }
    if (asset == 0) {
      setIsLoading(isPending);
      buyTokenWithBnb({
        value: dwtAmount,
        asset,
        referrer:
          referrerAddress || "0x0000000000000000000000000000000000000000",
        bnbValueWei,
      });
    } else if (asset == 1) {
      if (usdcValueEth > usdcBalanceOf) {
        toast.error("Insufficient balance");
        return;
      }
      if ((usdcAllowance as bigint) < (usdcValueWei as bigint)) {
        approveUSDC();
      } else if ((usdcAllowance as bigint) >= (usdcValueWei as bigint)) {
        buyTokensWithUSDC({
          value: dwtAmount,
          asset,
          referrer:
            referrerAddress || "0x0000000000000000000000000000000000000000",
        });
      }
    } else if (asset == 2) {
       if (usdtValueEth > usdtBalanceOf) {
        toast.error("Insufficient balance");
        return;
      }
      if ((allowance as bigint) < (usdtValueWei as bigint)) {
        approveUSDT();
      } else if ((allowance as bigint) >= (usdtValueWei as bigint)) {
        buyTokensWithUSDT({
          value: dwtAmount,
          asset,
          referrer:
            referrerAddress || "0x0000000000000000000000000000000000000000",
        });
      }
    }
  };
  const handleBuyToken = () => {
    if (approvalConfirmed) {
      buyTokensWithUSDT({
        value: dwtAmount,
        asset,
        referrer:
          referrerAddress || "0x0000000000000000000000000000000000000000",
      });
    }
  };
  const handleUSDCBuyToken = () => {
    if (approvalConfirmed) {
      buyTokensWithUSDC({
        value: dwtAmount,
        asset,
        referrer:
          referrerAddress || "0x0000000000000000000000000000000000000000",
      });
      // resetForm()
    }
  };

  useEffect(() => {
    if (approvalUsdcConfirmed) {
      handleUSDCBuyToken();
    }
  }, [approvalUsdcConfirmed]);
  useEffect(() => {
    handleBuyToken();
  }, [approvalConfirmed]);
  useEffect(() => {
    if (txBNBSuccess || txUSDTSuccess || txUSDCSuccess) {
      toast.success("Purchase DogWalker Token Successfully!");
      resetForm();
      refetchTokenSold();
      refetchIcoRemaining();
      dwtTokenRefetch();
      hasMinimumPurchasedRefetch();
      userSpentUSDRefetch()
    }
  }, [txBNBSuccess, txUSDTSuccess, txUSDCSuccess]);
  useEffect(() => {
    if (dwtAmount) {
      if (asset == 0) {
        setCalculateValue(bnbValueEth);
      } else if (asset == 1) {
        setCalculateValue(usdcValueEth);
      } else if (asset == 2) {
        setCalculateValue(usdtValueEth);
      }
    }
  }, [dwtAmount, asset, bnbValueEth, usdcValueEth]);
  useEffect(() => {
    if (router.isReady) {
      const referrerAddress = router.query["referr-address"];
      if (referrerAddress) {
        setReferrerAddress(referrerAddress);
      }
    }
  }, [router.isReady]);
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={() => {
            setDwtAmount("");
            setAsset("");
            // setReferrerAddress("");
            setPayableAmountFromWei("");
            setPayableAmount("");
            setShowModal(false);
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        <div className={styles.modalBody}>
          <label>
            Select Asset:
            <select
              value={asset}
              onChange={(e) => {
                setAsset(e.target.value);
                setDwtAmount("");
                setPayableAmountFromWei("");
                setPayableAmount("");
              }}
            >
              <option value="">Choose an option</option>
              <option value="0">BNB</option>
              <option value="1">USDC</option>
              <option value="2">USDT</option>
            </select>
          </label>

          {asset && (
            <>
              <label>
                DWT Amount
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={dwtAmount}
                  onChange={(e) => setDwtAmount(e.target.value)}
                />
                {error && !dwtAmount && (
                  <p style={{ color: "red", marginTop: "5px" }}>Enter Amount</p>
                )}
              </label>
              <label>
                Payable Amount:
                <input
                  type="number"
                  value={
                    asset == "0"
                      ? bnbValueEth?.toFixed(6)
                      : asset == "1"
                      ? usdcValueEth?.toFixed(6)
                      : usdtValueEth.toFixed(6)
                  }
                  readOnly
                />
              </label>

              <label>
                Referrer Address:
                <input
                  type="text"
                  placeholder="Enter address"
                  value={
                    referrerAddress
                      ? referrerAddress
                      : "0x0000000000000000000000000000000000000000"
                  }
                  readOnly
                />
              </label>
            </>
          )}
        </div>

        {asset && (
          <button
            className={styles.submitButton}
            onClick={handleWrite}
            disabled={
              txLoading ||
              isPending ||
              isUSDTPending ||
              isApproving ||
              isUSDCApproving ||
              isUSDCPending
            }
          >
            {txLoading ||
            isPending ||
            isUSDTPending ||
            isApproving ||
            isUSDCApproving ||
            isUSDCPending
              ? "Loading..."
              : "Purchase Token"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;
