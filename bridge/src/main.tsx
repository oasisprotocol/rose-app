import { FC } from 'react'
import { App } from './App'
import { RouterTransferSDKContextProvider } from './providers/RouterTransferSDKProvider'
import { NitroSwapAPIContextProvider } from './providers/NitroSwapAPIProvider'

export const BridgeApp: FC = () => (
  <NitroSwapAPIContextProvider>
    <RouterTransferSDKContextProvider>
      <App />
    </RouterTransferSDKContextProvider>
  </NitroSwapAPIContextProvider>
)
