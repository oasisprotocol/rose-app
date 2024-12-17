import ReactDOM from 'react-dom/client'
import { MoveApp } from '@oasisprotocol/rose-app-move'
import { stakeRouteObject } from '@oasisprotocol/rose-app-stake'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { App } from './App.tsx'
import { ProvidersWithSidebar } from './ProvidersWithSidebar.tsx'

import '@oasisprotocol/rose-app-ui/core/index.css'

const router = createHashRouter([
  {
    path: '',
    element: <ProvidersWithSidebar />,
    children: [
      {
        path: '/',
        element: <App />,
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
        path: '*',
        element: <App />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
