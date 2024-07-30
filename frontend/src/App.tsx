import { FC } from 'react'
import { Layout } from './components/Layout'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { EIP1193ContextProvider } from './providers/EIP1193Provider'
import { Web3ContextProvider } from './providers/Web3Provider'
import { AppStateContextProvider } from './providers/AppStateProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { RouterErrorBoundary } from './components/RouterErrorBoundary'
import { TestPage } from './pages/TestPage'
import { ApiContextProvider } from './providers/ApiProvider'
import { GrpcContextProvider } from './providers/GrpcProvider'

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
        path: 'test',
        element: <TestPage />,
      },
    ],
  },
])

export const App: FC = () => {
  return (
    <ErrorBoundary>
      <ApiContextProvider>
        <GrpcContextProvider>
          <EIP1193ContextProvider>
            <Web3ContextProvider>
              <AppStateContextProvider>
                <RouterProvider router={router} />
              </AppStateContextProvider>
            </Web3ContextProvider>
          </EIP1193ContextProvider>
        </GrpcContextProvider>
      </ApiContextProvider>
    </ErrorBoundary>
  )
}
