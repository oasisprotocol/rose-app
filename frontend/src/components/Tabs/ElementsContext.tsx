import { createContext } from 'react'

interface ElementsStateContextType {
  tabs: number
  panels: number
}

export const ElementsContext = createContext<ElementsStateContextType>({
  tabs: 0,
  panels: 0,
})
