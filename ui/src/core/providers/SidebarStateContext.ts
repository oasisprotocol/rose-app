import { createContext } from 'react'

export interface SidebarStateProviderState {
  isOpen: boolean
}

export interface SidebarStateProviderContext {
  readonly state: SidebarStateProviderState
  setIsOpen: (isOpen: boolean) => void
}

export const SidebarStateContext = createContext<SidebarStateProviderContext>(
  {} as SidebarStateProviderContext
)
