import { useContext } from 'react'
import { GrpcContext } from '../providers/GrpcContext'

export const useGrpc = () => {
  const value = useContext(GrpcContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useGrpc] Component not wrapped within a Provider')
  }

  return value
}
