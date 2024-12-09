import './utils/polyfill.ts'
import { RainbowKitProvider, Theme as RainbowkitTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import { Sidebar } from '../../src/components/Sidebar/index.tsx'
import { App } from './App.tsx'
import { config } from './wagmi.ts'

import '@rainbow-me/rainbowkit/styles.css'
import './index.css'
import { AccountAvatar } from './components/AccountAvatar/index.tsx'
import { SidebarAccount } from './components/SidebarAccount'

const queryClient = new QueryClient()
const rainbowkitTheme: RainbowkitTheme = {
  ...lightTheme({ accentColor: 'var(--brand-extra-dark)' }),
  fonts: {
    body: 'inherit',
  },
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={rainbowkitTheme}
          avatar={({ address, size }) => (
            <AccountAvatar diameter={size} account={{ address_eth: address as `0x${string}` }} />
          )}
        >
          <Sidebar navItem={<SidebarAccount />}>
            <App />
          </Sidebar>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
