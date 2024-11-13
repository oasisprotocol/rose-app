import { FC } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, Theme, lightTheme } from '@rainbow-me/rainbowkit'
import { Layout } from './components/Layout'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { Web3ContextProvider } from './providers/Web3Provider'
import { AppStateContextProvider } from './providers/AppStateProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { RouterErrorBoundary } from './components/RouterErrorBoundary'
import { ApiContextProvider } from './providers/ApiProvider'
import { GrpcContextProvider } from './providers/GrpcProvider'
import { DashboardPage } from './pages/DashboardPage'
import { StakePage } from './pages/StakePage'
import { StakingAmountPage } from './pages/StakingAmountPage'
import { UnstakePage } from './pages/UnstakePage'
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

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'stake/:address',
        element: <StakingAmountPage />,
      },
      {
        path: 'stake',
        element: <StakePage />,
      },
      {
        path: 'unstake/:address',
        element: <UnstakePage />,
      },
    ],
  },
])

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
                    <RouterProvider router={router} />
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
