import ReactDOM from 'react-dom/client'
import { stakeRouteObject } from '@oasisprotocol/rose-app-stake'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { App } from './App.tsx'
import { Sidebar } from './components/Sidebar'
import './index.css'

const router = createHashRouter([
  {
    path: '',
    children: [
      {
        path: '/',
        element: (
          <Sidebar>
            <App />
          </Sidebar>
        ),
      },
      {
        ...stakeRouteObject,
        path: 'stake',
        element: <Sidebar>{stakeRouteObject.element}</Sidebar>,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />)
