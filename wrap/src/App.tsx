import { FC } from 'react'
import { WrapLayout } from '@oasisprotocol/rose-app-ui/wrap'
import { Web3ContextProvider } from './providers/Web3Provider'

export const App: FC = () => (
  <Web3ContextProvider>
    <WrapLayout />
  </Web3ContextProvider>
)
