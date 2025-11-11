import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { GrpcContext, GrpcProviderContext, GrpcProviderState } from './GrpcContext'
import { AVERAGE_BLOCK_TIME_IN_SEC, AVERAGE_BLOCKS_PER_EPOCH, GRPC_URL_CONFIG } from '../constants/config'
import { DateUtils } from '../../../ui/src/stake/utils/date.utils'
import { getDelegations, getUndelegations } from '@oasisprotocol/rose-app-subcall'
import * as oasis from '@oasisprotocol/client'
import { useAccount } from 'wagmi'
import { useWeb3 } from '../hooks/useWeb3'

const grpcProviderInitialState: GrpcProviderState = {
  consensusStatus: null,
}

export const GrpcContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address, chainId } = useAccount()
  const {
    state: { isSupportedNetwork },
  } = useWeb3()

  const [state, setState] = useState<GrpcProviderState>({
    ...grpcProviderInitialState,
  })

  const getNode = () => {
    if (!GRPC_URL_CONFIG.has(chainId!)) {
      throw new Error('Invalid [chainId]')
    }

    return new oasis.client.NodeInternal(GRPC_URL_CONFIG.get(chainId!)!)
  }

  const fetchConsensusStatus = async (node = getNode()) => {
    if (state.consensusStatus) return state.consensusStatus

    const consensusStatus = await node.consensusGetStatus()

    setState(prevState => ({ ...prevState, consensusStatus }))

    return consensusStatus
  }

  const getTimeEstimateForFutureEpoch = async (futureEpoch: bigint, node = getNode()) => {
    // Skip in case futureEpoch unset(= 0n) UndelegateStart not called yet
    if (futureEpoch === 0n) {
      return null
    }

    const { consensusStatus } = state

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
    if (isSupportedNetwork) {
      fetchConsensusStatus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupportedNetwork])

  const providerState: GrpcProviderContext = {
    fetchConsensusStatus,
    getTimeEstimateForFutureEpoch,
    fetchDelegations: () => getDelegations(chainId!, address!),
    fetchUndelegations: () => getUndelegations(chainId!, address!),
  }

  return <GrpcContext.Provider value={providerState}>{children}</GrpcContext.Provider>
}
