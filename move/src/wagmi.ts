import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sapphireTestnet } from 'wagmi/chains'
import { SAPPHIRE_1RPC_CHAIN_CONFIG } from './constants/chains.ts'

const { VITE_WALLET_CONNECT_PROJECT_ID, PROD } = import.meta.env

export const config = getDefaultConfig({
  appName: 'ROSE Move',
  projectId: VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [PROD ? SAPPHIRE_1RPC_CHAIN_CONFIG : sapphireTestnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
  batch: {
    multicall: false,
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
