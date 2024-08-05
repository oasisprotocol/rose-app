import { Staking } from '@oasisprotocol/dapp-staker-backend'

export type Undelegations = [bigint[], Staking.PendingUndelegationStructOutput[]] & {
  receiptIds: bigint[]
  undelegations: Staking.PendingUndelegationStructOutput[]
}
