import { App } from './App'
import { RouteObject } from 'react-router-dom'
import { RouterErrorBoundary } from '@oasisprotocol/rose-app-ui/stake'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { StakingAmountPage } from './pages/StakingAmountPage'
import { StakePage } from './pages/StakePage'
import { UnstakePage } from './pages/UnstakePage'
import './index.css'

export const stakeRouteObject: RouteObject = {
  path: '',
  element: <App />,
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
}
