import './utils/polyfill.ts'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import { App } from './App.tsx'
import { config } from './wagmi.ts'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import { AccountAvatar } from './components/AccountAvatar/index.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          avatar={({ address, size }) => (
            <AccountAvatar diameter={size} account={{ address_eth: address as `0x${string}` }} />
          )}
        >
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
