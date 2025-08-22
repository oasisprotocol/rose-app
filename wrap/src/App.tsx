import { FC } from 'react'
import { Layout } from './components/Layout'
import { Web3ContextProvider } from './providers/Web3Provider'

export const App: FC = () => (
  <Web3ContextProvider>
    <Layout />
  </Web3ContextProvider>
)
