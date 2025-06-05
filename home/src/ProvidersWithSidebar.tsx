import { FC } from 'react'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from './constants/wagmi-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { FathomAnalytics } from './components/FathomAnalytics'
import { AppLayout } from '@oasisprotocol/rose-app-ui'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()
const rainbowKitTheme: Theme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
}

export const ProvidersWithSidebar: FC = () => (
  <>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowKitTheme}>
          <AppLayout />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    <FathomAnalytics />
  </>
)
