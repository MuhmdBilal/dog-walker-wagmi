import React, { useEffect, useRef, useState } from "react";
import {
  useConnect,
  useAccount,
  useBalance,
  useDisconnect,
  useChainId,
  Connector,
} from "wagmi";
// import "./walletConnect.css";
import classes from "../Nav/Nav.module.scss";

const WalletConnection = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const { connect, connectors } = useConnect();
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: balance }: any = useBalance({
    address,
    chainId: chain?.id,
  });

  // ✅ Prevent SSR hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // ✅ Mobile detection should only run client-side
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    }
  }, []);

  useEffect(() => {
    if (isConnected) setShowModal(false);
  }, [isConnected]);

  useEffect(() => {
    if (!chain?.id) return;
    console.log("🔄 Chain changed ->", chain?.id);
  }, [chain?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowModal(false);
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const handleConnect = () => {
    const connector = isMobile
      ? connectors.find((c) => c.id === "walletConnect")
      : connectors.find((c) => c.id === "metaMask" || c.id === "metaMaskSDK");

    if (!connector) {
      alert("Connector not found. Please ensure the wallet is installed.");
      return;
    }

    connect({ connector });
  };

  // 🛑 Avoid rendering until mounted
  if (!hasMounted) return null;

  return (
    <div className="wallet-container">
      <button
        className="connect-button"
        onClick={() => setShowModal((prev) => !prev)}
      >
        {isConnected ? (
          <>
            {address && `${address?.slice(0, 6)}...${address?.slice(-4)}`} |{" "}
            {Number(balance?.formatted || 0).toFixed(2)} {balance?.symbol}
          </>
        ) : (
          "Connect Wallet"
        )}
      </button>

      {showModal && (
        <div className="connect-section" ref={modalRef}>
          <div className="wallet-modal">
            <button className="wallet-option" onClick={handleConnect}>
              MetaMask
            </button>

            <button
              className="wallet-option"
              onClick={() => {
                const walletConnectConnector = connectors.find(
                  (c) => c.id === "walletConnect"
                );
                if (!walletConnectConnector) {
                  alert("WalletConnect not available");
                  return;
                }
                connect({ connector: walletConnectConnector });
              }}
            >
              WalletConnect
            </button>

            {isConnected && (
              <button
                className="disconnect-button"
                onClick={() => {
                  disconnect();
                  setShowModal(false);
                }}
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


export default WalletConnection;
