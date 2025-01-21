import { createContext } from 'react'
import { GetContractReturnType, Client } from 'viem'
import WrappedRoseMetadata from '../contracts/WrappedROSE.json'
import BigNumber from 'bignumber.js'

export interface Web3ProviderState {
  wRoseContractAddress: string | null
  wRoseContract: GetContractReturnType<typeof WrappedRoseMetadata.output.abi, Client> | null
  explorerBaseUrl: string | null
  isSupportedNetwork: boolean
}

export interface Web3ProviderContext {
  readonly state: Web3ProviderState
  wrap: (amount: string, gasPrice: BigNumber) => Promise<unknown>
  unwrap: (amount: string, gasPrice: BigNumber) => Promise<unknown>
  getBalance: () => Promise<bigint>
  getBalanceOfWROSE: () => Promise<bigint>
  getTransaction: (txHash: `0x${string}`) => Promise<unknown>
  addTokenToWallet: () => Promise<void>
  getGasPrice: () => Promise<bigint>
}

export const Web3Context = createContext<Web3ProviderContext>({} as Web3ProviderContext)
