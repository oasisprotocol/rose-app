import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { GrpcContext, GrpcProviderContext, GrpcProviderState } from './GrpcContext'
import { AVERAGE_BLOCK_TIME_IN_SEC, AVERAGE_BLOCKS_PER_EPOCH, VITE_GRPC_URL } from '../constants/config'
import * as oasis from '@oasisprotocol/client'
import { DateUtils } from '../utils/date.utils'

const grpcProviderInitialState: GrpcProviderState = {
  node: new oasis.client.NodeInternal(VITE_GRPC_URL),
  consensusStatus: null,
}

export const GrpcContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<GrpcProviderState>({
    ...grpcProviderInitialState,
  })

  const fetchConsensusStatus = async () => {
    const { node } = state

    if (state.consensusStatus) return state.consensusStatus

    const consensusStatus = await node.consensusGetStatus()

    setState(prevState => ({ ...prevState, consensusStatus }))

    return consensusStatus
  }

  const getTimeEstimateForFutureEpoch = async (futureEpoch: bigint) => {
    // Skip in case futureEpoch unset(= 0n) UndelegateStart not called yet
    if (futureEpoch === 0n) {
      return null
    }

    const { node, consensusStatus } = state

    if (consensusStatus === null) {
      console.warn('[consensusStatus] unset, skipping...')
      return null
    }

    const { latest_epoch, latest_height, latest_time } = consensusStatus

    if (futureEpoch < latest_epoch) {
      throw new Error("[futureEpoch] can't be smaller than [consensusStatus.latest_epoch]")
    }

    const currentEpochStartHeight = await node.beaconGetEpochBlock(latest_epoch)
    const diffEpochInBlocks = (Number(futureEpoch) - Number(latest_epoch) - 1) * AVERAGE_BLOCKS_PER_EPOCH
    const diffBlocksInCurrentEpoch =
      AVERAGE_BLOCKS_PER_EPOCH -
      Math.min(Math.max(Number(latest_height) - Number(currentEpochStartHeight), 0), 600)
    const diffBlocksInMilliseconds =
      (diffEpochInBlocks + diffBlocksInCurrentEpoch) * AVERAGE_BLOCK_TIME_IN_SEC

    return DateUtils.unixFormatToDate(Number(latest_time) + diffBlocksInMilliseconds)
  }

  useEffect(() => {
    fetchConsensusStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const providerState: GrpcProviderContext = {
    state,
    fetchConsensusStatus,
    getTimeEstimateForFutureEpoch,
  }

  return <GrpcContext.Provider value={providerState}>{children}</GrpcContext.Provider>
}
