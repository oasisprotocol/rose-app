import { FC, PropsWithChildren, useEffect, useState } from 'react'
import {
  DelegationsQueryWrapperArgs,
  DelegationsQueryWrapperResponse,
  GrpcContext,
  GrpcProviderContext,
  GrpcProviderState,
  UndelegationsQueryWrapperArgs,
  UndelegationsQueryWrapperResponse,
} from './GrpcContext'
import {
  AVERAGE_BLOCK_TIME_IN_SEC,
  AVERAGE_BLOCKS_PER_EPOCH,
  VITE_GRPC_URL,
  VITE_PARATIME_RUNTIME_ID,
} from '../constants/config'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { DateUtils } from '../utils/date.utils'
import { useWeb3 } from '../hooks/useWeb3'
import { FormattingUtils } from '../utils/formatting.utils'

const CONSENSUS_DELEGATIONS = 'consensus.Delegations'
const CONSENSUS_UNDELEGATIONS = 'consensus.Undelegations'

const grpcProviderInitialState: GrpcProviderState = {
  node: new oasis.client.NodeInternal(VITE_GRPC_URL),
  delegationsAccountWrapper: new oasisRT.wrapper.QueryWrapper<
    DelegationsQueryWrapperArgs,
    DelegationsQueryWrapperResponse
  >(oasis.misc.fromHex(VITE_PARATIME_RUNTIME_ID), CONSENSUS_DELEGATIONS),
  undelegationsAccountWrapper: new oasisRT.wrapper.QueryWrapper<
    UndelegationsQueryWrapperArgs,
    UndelegationsQueryWrapperResponse
  >(oasis.misc.fromHex(VITE_PARATIME_RUNTIME_ID), CONSENSUS_UNDELEGATIONS),
  consensusStatus: null,
}

export const GrpcContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    state: { account },
  } = useWeb3()

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

  const fetchDelegations = async () => {
    if (!account) {
      throw new Error('[account] should be defined, connect your wallet first!')
    }

    const { delegationsAccountWrapper, node } = state

    const from = await FormattingUtils.toSecp256k1eth(account)
    const delegations = await delegationsAccountWrapper.setArgs({ from }).query(node)

    return delegations.map(({ to, shares }) => ({
      to: oasis.staking.addressToBech32(to),
      shares: oasis.quantity.toBigInt(shares),
    }))
  }
  const fetchUndelegations = async () => {
    if (!account) {
      throw new Error('[account] should be defined, connect your wallet first!')
    }

    const { undelegationsAccountWrapper, node } = state

    const to = await FormattingUtils.toSecp256k1eth(account)
    const undelegations = await undelegationsAccountWrapper.setArgs({ to }).query(node)

    return undelegations.map(({ from, shares, epoch }) => ({
      from: oasis.staking.addressToBech32(from),
      shares: oasis.quantity.toBigInt(shares),
      epoch: BigInt(epoch),
    }))
  }

  useEffect(() => {
    fetchConsensusStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const providerState: GrpcProviderContext = {
    state,
    fetchConsensusStatus,
    getTimeEstimateForFutureEpoch,
    fetchDelegations,
    fetchUndelegations,
  }

  return <GrpcContext.Provider value={providerState}>{children}</GrpcContext.Provider>
}
