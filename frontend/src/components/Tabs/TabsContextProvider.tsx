import { FC, PropsWithChildren, useRef, useState } from 'react'
import { ElementsContext } from './ElementsContext'
import { TabsContext } from './TabsContext'

export const TabsContextProvider: FC<
  PropsWithChildren<{ state?: [number, (state: number) => void]; activeIndex?: number }>
> = ({ state: outerState, activeIndex, children }) => {
  const innerState = useState(activeIndex || 0)
  const elements = useRef({ tabs: 0, panels: 0 })
  const state = outerState || innerState

  return (
    <ElementsContext.Provider value={elements.current}>
      <TabsContext.Provider value={state}>{children}</TabsContext.Provider>
    </ElementsContext.Provider>
  )
}
