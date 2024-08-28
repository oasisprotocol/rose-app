import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sapphire } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'ROSE On-Ramp',
  projectId: 'YOUR_PROJECT_ID', //
  chains: [sapphire],
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
