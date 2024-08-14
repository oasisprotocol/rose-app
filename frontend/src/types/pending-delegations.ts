import { Staking } from '@oasisprotocol/dapp-staker-backend'

export type PendingDelegations = [bigint[], Staking.PendingDelegationStructOutput[]] & {
  receiptIds: bigint[]
  pendings: Staking.PendingDelegationStructOutput[]
}
