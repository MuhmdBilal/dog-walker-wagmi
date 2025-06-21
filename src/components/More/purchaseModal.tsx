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
  usePreviewBNB,
  usePreviewUSDC,
  usePreviewUSDT,
} from "@/utils/useIcoContract";
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
  //   const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  const bnbEnabled = asset == 0 && !!dwtAmount;
  const usdcEnabled = asset == 1 && !!dwtAmount;
  const usdtEnabled = asset == 2 && !!dwtAmount;
  const { bnbValueEth, bnbValueWei } = usePreviewBNB(
    bnbEnabled ? dwtAmount : null
  );
  const { usdcValueEth } = usePreviewUSDC(usdcEnabled ? dwtAmount : null);
  const { usdtValueEth } = usePreviewUSDT(usdtEnabled ? dwtAmount : null);
  const { buyTokenWithBnb, txLoading, txBNBSuccess, isPending } =
    useBnbTokenPurchase();
  const handleWrite = () => {
    if (!dwtAmount) {
      setError(true);
      return;
    }
    if (asset == 0) {
      buyTokenWithBnb({
        value: dwtAmount,
        asset,
        referrer:
          referrerAddress || "0x0000000000000000000000000000000000000000",
        bnbValueWei,
      });
    }
  };
  useEffect(() => {
    if (txBNBSuccess) {
      toast.success("Purchase DogWalker Token Successfully!");
    }
  }, [txBNBSuccess]);
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
            disabled={txLoading || isPending}
          >
            {txLoading || isPending ? "Loading..." : "Purchase Token"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PurchaseModal;
