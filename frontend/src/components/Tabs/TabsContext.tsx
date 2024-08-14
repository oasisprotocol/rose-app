import { createContext } from 'react'

export const TabsContext = createContext<[number, (state: number) => void]>([0, () => {}])
