import { useContext } from 'react'
import { ApiContext } from '../providers/ApiContext'

export const useApi = () => {
  const value = useContext(ApiContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useApi] Component not wrapped within a Provider')
  }

  return value
}
