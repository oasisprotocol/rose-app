import { FC, ReactNode, useContext, useMemo, useRef } from 'react'
import { TabsContext } from './TabsContext'
import { ElementsContext } from './ElementsContext'
import { StringUtils } from '../../utils/string.utils'

const useTabState = () => {
  const [activeIndex, setActive] = useContext(TabsContext)
  const elements = useContext(ElementsContext)

  const tabIndex = useRef(
    (() => {
      const currentIndex = elements.tabs
      elements.tabs += 1

      return currentIndex
    })()
  )

  return useMemo(
    () => ({
      isActive: activeIndex === tabIndex.current,
      onClick: () => setActive(tabIndex.current),
    }),
    [activeIndex, setActive]
  )
}

export const Tab: FC<{ children: ((state: ReturnType<typeof useTabState>) => ReactNode) | ReactNode }> = ({
  children,
}) => {
  const state = useTabState()

  if (typeof children === 'function') {
    return children(state)
  }

  const { isActive, onClick } = state

  return (
    <li onClick={onClick} className={StringUtils.clsx(...(isActive ? ['active'] : []))}>
      {children}
    </li>
  )
}
