// pages/_app.tsx
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";
import Head from "next/head";
import { appWithTranslation } from "next-i18next";
import nextI18NextConfig from "../../next-i18next.config";
import LayoutClient from "../components/More/LayoutClient";
import "react-toastify/dist/ReactToastify.css";
import { WagmiProvider, http, createConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { walletConnect, injected, metaMask } from "wagmi/connectors";

const projectId = "a35691f011761d63c1dd60354147a840";
import { ToastContainer } from "react-toastify";
import { bscMainnet } from "@/components/chain";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const origin =
  typeof window !== "undefined" ? window.location.origin : "https://reliable-hummingbird-72c4a6.netlify.app";
const config = createConfig({
  chains: [bscMainnet],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId,
      metadata: {
        name: "YourApp",
        description: "Your App description",
        url: origin,
        icons: ["https://yourapp.com/icon.png"],
      },

      showQrModal: true,
    }),
  ],
  transports: {
    // [mainnet.id]: http(),
    // [polygon.id]: http(),
    // [optimism.id]: http(),
    [bscMainnet.id]: http("https://bsc-dataseed.binance.org"),
    // [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.binance.org:8545"),
  },
});
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>DogWalker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="container">
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <LayoutClient>
                <Component {...pageProps} />
                <ToastContainer />
              </LayoutClient>
            </QueryClientProvider>
          </WagmiProvider>
        </div>
      </div>
    </>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
