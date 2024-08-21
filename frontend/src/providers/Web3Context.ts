import { createContext } from 'react'
import * as sapphire from '@oasisprotocol/sapphire-paratime'
import { BrowserProvider, TransactionResponse } from 'ethers'
import { Staking } from '@oasisprotocol/dapp-staker-backend'
import { DefaultReturnType, Delegations, PendingDelegations, Undelegations } from '../types'

export interface Web3ProviderState {
  isConnected: boolean
  ethProvider: BrowserProvider | null
  sapphireEthProvider: (BrowserProvider & sapphire.SapphireAnnex) | null
  account: string | null
  explorerBaseUrl: string | null
  chainName: string | null
  stakingWithoutSigner: Staking | null
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  } | null
}

export interface Web3ProviderContext {
  readonly state: Web3ProviderState
  connectWallet: () => Promise<void>
  switchNetwork: (chainId?: bigint) => Promise<void>
  getTransaction: (txHash: string) => Promise<TransactionResponse | null>
  getGasPrice: () => Promise<bigint>
  isProviderAvailable: () => Promise<boolean>
  getBalance: () => Promise<bigint>
  delegate: (value: bigint, to: string, txSubmittedCb?: () => void) => Promise<bigint>
  getPendingDelegations: () => Promise<DefaultReturnType<[PendingDelegations]>>
  delegateDone: (receiptId: bigint) => Promise<TransactionResponse>
  getDelegations: () => Promise<DefaultReturnType<[Delegations]>>
  undelegate: (shares: bigint, from: string) => Promise<TransactionResponse>
  getUndelegations: () => Promise<DefaultReturnType<[Undelegations]>>
  getUndelegationReceiptId: (filterBy: Partial<Staking.PendingUndelegationStruct>) => Promise<bigint | null>
  undelegateStart: (receiptId: bigint, txSubmittedCb?: () => void) => Promise<bigint>
  undelegateDone: (receiptId: bigint) => Promise<TransactionResponse>
}

export const Web3Context = createContext<Web3ProviderContext>({} as Web3ProviderContext)
