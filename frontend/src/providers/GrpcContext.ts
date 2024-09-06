import { createContext } from 'react'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { Delegations, Undelegations } from '../types'

export type DelegationsQueryWrapperArgs = { from: Uint8Array }
export type DelegationsQueryWrapperResponse = { shares: Uint8Array; to: Uint8Array }[]
export type UndelegationsQueryWrapperArgs = { to: Uint8Array }
export type UndelegationsQueryWrapperResponse = { shares: Uint8Array; from: Uint8Array; epoch: number }[]

export interface GrpcProviderState {
  node: oasis.client.NodeInternal
  delegationsAccountWrapper: oasisRT.wrapper.QueryWrapper<
    DelegationsQueryWrapperArgs,
    DelegationsQueryWrapperResponse
  >
  undelegationsAccountWrapper: oasisRT.wrapper.QueryWrapper<
    UndelegationsQueryWrapperArgs,
    UndelegationsQueryWrapperResponse
  >
  consensusStatus: oasis.types.ConsensusStatus | null
}

export interface GrpcProviderContext {
  readonly state: GrpcProviderState
  fetchConsensusStatus: () => Promise<oasis.types.ConsensusStatus>
  getTimeEstimateForFutureEpoch: (epoch: bigint) => Promise<Date | null>
  fetchDelegations: () => Promise<Delegations>
  fetchUndelegations: () => Promise<Undelegations>
}

export const GrpcContext = createContext<GrpcProviderContext>({} as GrpcProviderContext)
