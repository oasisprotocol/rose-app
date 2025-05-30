import { FC } from 'react'
import { Layout } from './components/Layout'
import { Web3ContextProvider } from './providers/Web3Provider'
import { AppStateContextProvider } from './providers/AppStateProvider'
import { ErrorBoundary } from '@oasisprotocol/rose-app-ui/stake'
import { ApiContextProvider } from './providers/ApiProvider'
import { GrpcContextProvider } from './providers/GrpcProvider'

export const App: FC = () => {
  return (
    <ErrorBoundary>
      <Web3ContextProvider>
        <ApiContextProvider>
          <GrpcContextProvider>
            <AppStateContextProvider>
              <Layout />
            </AppStateContextProvider>
          </GrpcContextProvider>
        </ApiContextProvider>
      </Web3ContextProvider>
    </ErrorBoundary>
  )
}
