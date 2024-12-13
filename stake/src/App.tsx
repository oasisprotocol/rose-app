import { FC } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, Theme, lightTheme } from '@rainbow-me/rainbowkit'
import { Layout } from './components/Layout'
import { Web3ContextProvider } from './providers/Web3Provider'
import { AppStateContextProvider } from './providers/AppStateProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ApiContextProvider } from './providers/ApiProvider'
import { GrpcContextProvider } from './providers/GrpcProvider'
import { wagmiConfig } from './constants/wagmi-config'
import { AccountAvatar } from './components/AccountAvatar'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()
const rainbowKitTheme: Theme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
}

export const App: FC = () => {
  return (
    <ErrorBoundary>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            theme={rainbowKitTheme}
            avatar={({ address, size }) => (
              <AccountAvatar diameter={size} account={{ address_eth: address as `0x${string}` }} />
            )}
          >
            <Web3ContextProvider>
              <ApiContextProvider>
                <GrpcContextProvider>
                  <AppStateContextProvider>
                    <Layout />
                  </AppStateContextProvider>
                </GrpcContextProvider>
              </ApiContextProvider>
            </Web3ContextProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}
