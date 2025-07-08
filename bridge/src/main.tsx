import { FC } from 'react'
import { App } from './App'
import { RouterPathfinderContextProvider } from './providers/RouterPathfinderProvider'
import { NitroSwapAPIContextProvider } from './providers/NitroSwapAPIProvider'

export const BridgeApp: FC = () => (
  <NitroSwapAPIContextProvider>
    <RouterPathfinderContextProvider>
      <App />
    </RouterPathfinderContextProvider>
  </NitroSwapAPIContextProvider>
)
