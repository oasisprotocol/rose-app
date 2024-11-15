import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sapphire, sapphireTestnet } from 'wagmi/chains'

const { VITE_WALLET_CONNECT_PROJECT_ID, PROD } = import.meta.env

export const config = getDefaultConfig({
  appName: 'ROSE Move',
  projectId: VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [PROD ? sapphire : sapphireTestnet],
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
