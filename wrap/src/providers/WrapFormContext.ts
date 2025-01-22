import { createContext } from 'react'
import { WrapFormType } from '../utils/types'
import BigNumber from 'bignumber.js'

export interface WrapFormProviderState {
  isLoading: boolean
  amount: BigNumber | null
  formType: WrapFormType
  balance: BigNumber
  wRoseBalance: BigNumber
  estimatedFee: BigNumber
  estimatedGasPrice: BigNumber
}

export interface WrapFormProviderContext {
  readonly state: WrapFormProviderState
  init: () => void
  setAmount: (amount: BigNumber) => void
  toggleFormType: (amount: BigNumber | null) => void
  submit: (amount: BigNumber) => Promise<unknown>
  setFeeAmount: () => Promise<void>
  debounceLeadingSetFeeAmount: (fn?: () => Promise<void>, timeout?: number) => () => void
}

export const WrapFormContext = createContext<WrapFormProviderContext>({} as WrapFormProviderContext)
