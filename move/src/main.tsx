import './utils/polyfill.ts'
import { RainbowKitProvider, Theme as RainbowkitTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { App } from './App.tsx'
import { config } from './wagmi.ts'
import { AccountAvatar } from './components/AccountAvatar'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import { FC } from 'react'

const queryClient = new QueryClient()
const rainbowkitTheme: RainbowkitTheme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
}

export const MoveApp: FC = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={rainbowkitTheme}
        avatar={({ address, size }) => (
          <AccountAvatar diameter={size} account={{ address_eth: address as `0x${string}` }} />
        )}
      >
        <App />
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)
