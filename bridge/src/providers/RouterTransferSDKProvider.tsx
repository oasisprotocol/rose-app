import { FC, PropsWithChildren, useState } from 'react'
import {
  RouterTransferSDKContext,
  RouterTransferSDKProviderContext,
  RouterTransferSDKProviderState,
} from './RouterTransferSDKContext'

import { PathFinder, Network } from '@routerprotocol/asset-transfer-sdk-ts'

const routerTransferSDKProviderInitialState: RouterTransferSDKProviderState = {
  pathFinder: new PathFinder(Network.Mainnet, '1'), // Replace with actual widgetId
}

export const RouterTransferSDKContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state] = useState<RouterTransferSDKProviderState>({
    ...routerTransferSDKProviderInitialState,
  })

  const getQuote = async (...params: Parameters<PathFinder['getQuote']>) => {
    const { pathFinder } = state
    return await pathFinder.getQuote(...params)
  }

  const providerState: RouterTransferSDKProviderContext = {
    state,
    getQuote,
  }

  return (
    <RouterTransferSDKContext.Provider value={providerState}>{children}</RouterTransferSDKContext.Provider>
  )
}
