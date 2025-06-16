import { createContext } from 'react'
import { PathFinder } from '@routerprotocol/asset-transfer-sdk-ts'

export interface RouterTransferSDKProviderState {
  pathFinder: PathFinder
}

export interface RouterTransferSDKProviderContext {
  readonly state: RouterTransferSDKProviderState
  getQuote: (...params: Parameters<PathFinder['getQuote']>) => ReturnType<PathFinder['getQuote']>
}

export const RouterTransferSDKContext = createContext<RouterTransferSDKProviderContext>(
  {} as RouterTransferSDKProviderContext
)
