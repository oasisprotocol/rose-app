import { FC, PropsWithChildren, useState } from 'react'
import {
  SidebarStateContext,
  SidebarStateProviderContext,
  SidebarStateProviderState,
} from './SidebarStateContext'

const appStateProviderInitialState: SidebarStateProviderState = {
  isOpen: false,
}

export const AppStateContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState({ ...appStateProviderInitialState })

  const setIsOpen: SidebarStateProviderContext['setIsOpen'] = isOpen => {
    setState(prevState => ({ ...prevState, isOpen }))
  }

  const providerState: SidebarStateProviderContext = {
    state,
    setIsOpen,
  }

  return <SidebarStateContext.Provider value={providerState}>{children}</SidebarStateContext.Provider>
}
