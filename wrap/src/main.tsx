import { App } from './App'
import { RouteObject } from 'react-router-dom'
import { ConnectWallet } from './pages/ConnectWallet'
import { WrapFormContextProvider } from './providers/WrapFormProvider'
import { Wrapper } from './pages/Wrapper'
import { Transaction } from './pages/Transaction'

export const wrapRouteObject: RouteObject = {
  path: '',
  element: <App />,
  children: [
    {
      path: '',
      element: <ConnectWallet />,
    },
    {
      path: 'wrapper',
      element: (
        <WrapFormContextProvider>
          <Wrapper />
        </WrapFormContextProvider>
      ),
    },
    {
      path: 'tx/:txHash',
      element: <Transaction />,
    },
  ],
}
