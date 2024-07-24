import { createContext } from 'react'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { BrowserProvider, TransactionResponse } from 'ethers'
import { Staking } from '@oasisprotocol/dapp-staker-backend'
import { DefaultReturnType } from '../types'

export interface Web3ProviderState {
  isConnected: boolean
  ethProvider: BrowserProvider | null
  sapphireEthProvider: (BrowserProvider & sapphire.SapphireAnnex) | null
  account: string | null
  explorerBaseUrl: string | null
  chainName: string | null
  stakingWithoutSigner: Staking | null
}

export interface Web3ProviderContext {
  readonly state: Web3ProviderState
  connectWallet: () => Promise<void>
  switchNetwork: (chainId?: bigint) => Promise<void>
  getTransaction: (txHash: string) => Promise<TransactionResponse | null>
  isProviderAvailable: () => Promise<boolean>
  getBalance: () => Promise<bigint>
  delegate: (value: bigint, to: string) => Promise<TransactionResponse>
  getPendingDelegations: () => Promise<
    DefaultReturnType<
      [
        [bigint[], Staking.PendingDelegationStructOutput[]] & {
          receiptIds: bigint[]
          pendings: Staking.PendingDelegationStructOutput[]
        },
      ]
    >
  >
  delegateDone: (receiptId: bigint) => Promise<TransactionResponse>
  getDelegations: () => Promise<
    DefaultReturnType<
      [
        [string[], Staking.DelegationStructOutput[]] & {
          out_delegates: string[]
          out_delegations: Staking.DelegationStructOutput[]
        },
      ]
    >
  >
  undelegate: (shares: bigint, from: string) => Promise<TransactionResponse>
  getUndelegations: () => Promise<
    DefaultReturnType<
      [
        [bigint[], Staking.PendingUndelegationStructOutput[]] & {
          receiptIds: bigint[]
          undelegations: Staking.PendingUndelegationStructOutput[]
        },
      ]
    >
  >
  undelegateStart: (receiptId: bigint) => Promise<TransactionResponse>
  undelegateDone: (receiptId: bigint) => Promise<TransactionResponse>
}

export const Web3Context = createContext<Web3ProviderContext>({} as Web3ProviderContext)
