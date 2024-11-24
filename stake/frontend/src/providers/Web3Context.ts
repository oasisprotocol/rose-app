import { createContext } from 'react'
import type { TransactionReceipt, TransactionRequest } from 'viem'

export interface Web3ProviderState {
  explorerBaseUrl: string | null
  isInteractingWithChain: boolean
  isSupportedNetwork: boolean
}

export interface Web3ProviderContext {
  readonly state: Web3ProviderState
  populateDelegateTx: (value: bigint, to: string, gasPrice: bigint) => Promise<TransactionRequest>
  populateUndelegateTx: (shares: bigint, from: string, gasPrice: bigint) => Promise<TransactionRequest>
  getTransactionReceipt: (hash: `0x${string}`) => Promise<TransactionReceipt>
}

export const Web3Context = createContext<Web3ProviderContext>({} as Web3ProviderContext)
