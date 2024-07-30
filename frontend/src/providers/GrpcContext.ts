import { createContext } from 'react'
import * as oasis from '@oasisprotocol/client'

export interface GrpcProviderState {
  node: oasis.client.NodeInternal
  consensusStatus: oasis.types.ConsensusStatus | null
}

export interface GrpcProviderContext {
  readonly state: GrpcProviderState
  fetchConsensusStatus: () => Promise<oasis.types.ConsensusStatus>
  getTimeEstimateForFutureEpoch: (epoch: bigint) => Promise<Date | null>
}

export const GrpcContext = createContext<GrpcProviderContext>({} as GrpcProviderContext)
