import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Web3ContextProvider } from './providers/Web3Provider'

export const App: FC = () => (
  <Web3ContextProvider>
    <div className="p-6 w-full flex">
      <Outlet />
    </div>
  </Web3ContextProvider>
)
