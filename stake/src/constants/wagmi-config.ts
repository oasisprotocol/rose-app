import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { SAPPHIRE_1RPC_CHAIN_CONFIG, SAPPHIRE_TESTNET_CHAIN_CONFIG } from './config'

const { VITE_WALLET_CONNECT_PROJECT_ID, PROD } = import.meta.env

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof getDefaultConfig>
  }
}

export const wagmiConfig: ReturnType<typeof getDefaultConfig> = getDefaultConfig({
  appName: 'ROSE Stake',
  projectId: VITE_WALLET_CONNECT_PROJECT_ID,
  chains: [PROD ? SAPPHIRE_1RPC_CHAIN_CONFIG : SAPPHIRE_TESTNET_CHAIN_CONFIG],
  ssr: false,
  batch: {
    multicall: false,
  },
})
