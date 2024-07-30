import { createContext } from 'react'
import { ValidatorList } from '@oasisprotocol/nexus-api'

export interface ApiProviderState {}

export interface ApiProviderContext {
  readonly state: ApiProviderState
  getValidators: () => Promise<ValidatorList>
}

export const ApiContext = createContext<ApiProviderContext>({} as ApiProviderContext)
