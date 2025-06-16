import { useContext } from 'react'
import { NitroSwapAPIContext } from '../providers/NitroSwapAPIContext'

export const useNitroSwapAPI = () => {
  const value = useContext(NitroSwapAPIContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useNitroSwapAPI] Component not wrapped within a Provider')
  }

  return value
}
