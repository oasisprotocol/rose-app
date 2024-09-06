import { createContext } from 'react'
import { Delegations, Undelegations } from '../types'
import { Validator, ValidatorList } from '@oasisprotocol/nexus-api'

export interface AppStateProviderState {
  appError: string
  isDesktopScreen: boolean
  isMobileScreen: boolean
  stats: {
    balances: {
      accountBalance?: bigint
      totalStaked?: bigint
      totalDebonding?: bigint
    }
    numOfItems: {
      numOfStakes?: number
      numOfDebondings?: number
    }
  } | null
  delegations: Delegations | null
  undelegations: Undelegations | null
  validatorsList: ValidatorList | null
}

export interface AppStateProviderContext {
  readonly state: AppStateProviderState
  setAppError: (error: Error | object | string) => void
  clearAppError: () => void
  getValidatorByAddress: (opts: { hexAddress?: string; address?: string }) => Promise<Validator | null>
  fetchDelegations: () => Promise<Delegations>
  fetchUndelegations: () => Promise<Undelegations>
}

export const AppStateContext = createContext<AppStateProviderContext>({} as AppStateProviderContext)
