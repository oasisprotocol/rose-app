import { useContext } from 'react'
import { RouterTransferSDKContext } from '../providers/RouterTransferSDKContext'

export const useRouterTransferSDK = () => {
  const value = useContext(RouterTransferSDKContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useRouterTransferSDK] Component not wrapped within a Provider')
  }

  return value
}
