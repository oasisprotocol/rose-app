import { createContext } from 'react'
import { Delegations, PendingDelegations, Undelegations } from '../types'
import { Validator, ValidatorList } from '@oasisprotocol/nexus-api'

export interface AppStateProviderState {
  appError: string
  isDesktopScreen: boolean
  isMobileScreen: boolean
  stats: {
    balances: {
      accountBalance?: bigint
      totalPendingStake?: bigint
      totalStaked?: bigint
      totalPendingDebondings?: bigint
      totalDebonding?: bigint
    }
    numOfItems: {
      numOfPendingStakes?: number
      numOfStakes?: number
      numOfPendingDebondings?: number
      numOfDebondings?: number
      numOfAvailableToClaimDebondings?: number
    }
  } | null
  pendingDelegations: PendingDelegations | null
  delegations: Delegations | null
  undelegations: Undelegations | null
  validatorsList: ValidatorList | null
}

export interface AppStateProviderContext {
  readonly state: AppStateProviderState
  setAppError: (error: Error | object | string) => void
  clearAppError: () => void
  getValidatorByAddress: (opts: { hexAddress?: string; address?: string }) => Promise<Validator | null>
}

export const AppStateContext = createContext<AppStateProviderContext>({} as AppStateProviderContext)
