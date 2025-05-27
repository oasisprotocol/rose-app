import ReactDOM from 'react-dom/client'
import { MoveApp } from '@oasisprotocol/rose-app-move'
import { stakeRouteObject } from '@oasisprotocol/rose-app-stake'
import { wrapRouteObject } from '@oasisprotocol/rose-app-wrap'
import { DiscoverApp } from '@oasisprotocol/rose-app-discover'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { App } from './App.tsx'
import { ProvidersWithSidebar } from './ProvidersWithSidebar.tsx'

import './styles/global.css'
import '@oasisprotocol/rose-app-ui/core/index.css'

const router = createBrowserRouter([
  {
    path: '',
    element: <ProvidersWithSidebar />,
    children: [
      {
        path: '/',
        element: <App />,
      },
      {
        ...wrapRouteObject,
        path: 'wrap',
      },
      {
        ...stakeRouteObject,
        path: 'stake',
      },
      {
        path: 'move',
        element: <MoveApp />,
      },
      {
        path: 'discover',
        element: <DiscoverApp />,
      },
      {
        path: '*',
        element: <App />,
      },
    ],
  },
])

// Redirect from old URLs to new URLs
if (location.pathname + location.hash === '/#/wrap') location.href = '/wrap'
if (location.pathname + location.hash === '/#/stake') location.href = '/stake'
if (location.pathname + location.hash === '/#/move') location.href = '/move'
if (location.pathname + location.hash === '/#/discover') location.href = '/discover'

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
