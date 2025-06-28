// chains/bscMainnet.ts
import { defineChain } from "viem";

export const bscMainnet = defineChain({
  id: 56,
  name: "Binance Smart Chain",
  nativeCurrency: {
    name: "Binance Chain Native Token",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-dataseed.binance.org/"],
    },
    public: {
      http: ["https://bsc-dataseed.binance.org/"],
    },
  },
  blockExplorers: {
    default: {
      name: "BscScan",
      url: "https://bscscan.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      // Optional block number if needed
      // blockCreated: 15921452n, // example block, update if needed
    },
  },
} as const); // `as const` ensures proper type inference
