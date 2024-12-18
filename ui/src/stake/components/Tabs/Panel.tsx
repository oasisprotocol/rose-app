import { FC, PropsWithChildren, useContext, useRef } from 'react'
import { TabsContext } from './TabsContext'
import { ElementsContext } from './ElementsContext'

const usePanelState = () => {
  const [activeIndex] = useContext(TabsContext)
  const elements = useContext(ElementsContext)

  const panelIndex = useRef(
    (() => {
      const currentIndex = elements.panels
      elements.panels += 1

      return currentIndex
    })()
  )

  return panelIndex.current === activeIndex
}

export const Panel: FC<PropsWithChildren> = ({ children }) => {
  const isActive = usePanelState()

  return isActive ? <>{children}</> : null
}
