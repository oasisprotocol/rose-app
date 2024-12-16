import { FC } from 'react'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './constants/wagmi-config.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { AccountAvatar } from '@oasisprotocol/rose-app-ui/core'
import { Sidebar } from '@oasisprotocol/rose-app-ui/core'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()
const rainbowKitTheme: Theme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
}

export const ProvidersWithSidebar: FC = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={rainbowKitTheme}
        avatar={({ address, size }) => (
          <AccountAvatar diameter={size} account={{ address_eth: address as `0x${string}` }} />
        )}
      >
        <Sidebar />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
