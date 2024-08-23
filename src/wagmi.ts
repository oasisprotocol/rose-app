import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

/*
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { http, createConfig } from 'wagmi'
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
*/

export const config = getDefaultConfig({
  appName: "ROSE Migrator",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
