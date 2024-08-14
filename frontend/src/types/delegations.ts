import { Staking } from '@oasisprotocol/dapp-staker-backend'

export type Delegations = [string[], Staking.DelegationStructOutput[]] & {
  out_delegates: string[]
  out_delegations: Staking.DelegationStructOutput[]
}
