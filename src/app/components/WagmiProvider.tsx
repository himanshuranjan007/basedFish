"use client";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { parseEther, toHex } from "viem";
import { http, cookieStorage, createConfig, createStorage } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { coinbaseWallet, type CoinbaseWalletParameters } from "wagmi/connectors";

// Extend the CoinbaseWalletParameters type with our custom properties
type ExtendedCoinbaseWalletConfig = CoinbaseWalletParameters & {
  preference?: {
    keysUrl: string;
  };
  subAccounts?: {
    enableAutoSubAccounts: boolean;
    defaultSpendLimits: {
      [chainId: number]: Array<{
        token: string;
        allowance: string;
        period: number;
      }>;
    };
  };
};

const walletConfig: ExtendedCoinbaseWalletConfig = {
  appName: "Coin Your Bangers",
  preference: {
    keysUrl: "https://keys-dev.coinbase.com/connect",
  },
  subAccounts: {
    enableAutoSubAccounts: true,
    defaultSpendLimits: {
      84532: [ // Base Sepolia Chain ID
        {
          token: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          allowance: toHex(parseEther('0.01')),
          period: 86400,
        },
      ],
    },
  },
};

export const cbWalletConnector = coinbaseWallet(walletConfig);

export function getConfig() {
  return createConfig({
    chains: [baseSepolia],
    connectors: [cbWalletConnector],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [baseSepolia.id]: http('https://sepolia.base.org'),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

const queryClient = new QueryClient();

export default function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  const config = getConfig();
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
} 