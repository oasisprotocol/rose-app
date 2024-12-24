import { useContext } from 'react'
import { SidebarStateContext } from '../providers/SidebarStateContext'

export const useSidebarState = () => {
  const value = useContext(SidebarStateContext)
  if (Object.keys(value).length === 0) {
    throw new Error('[useSidebarState] Component not wrapped within a Provider')
  }

  return value
}
