import { toSecp256k1eth } from './utils.ts'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { Delegations, Undelegations } from './types.ts'

const PARATIME_RUNTIME_ID = import.meta.env.VITE_PARATIME_RUNTIME_ID
const GRPC_URL = import.meta.env.VITE_GRPC_URL

const CONSENSUS_DELEGATIONS = 'consensus.Delegations'
const CONSENSUS_UNDELEGATIONS = 'consensus.Undelegations'

type DelegationsQueryWrapperArgs = { from: Uint8Array }
type DelegationsQueryWrapperResponse = { shares: Uint8Array; to: Uint8Array }[]
type UndelegationsQueryWrapperArgs = { to: Uint8Array }
type UndelegationsQueryWrapperResponse = { shares: Uint8Array; from: Uint8Array; epoch: number }[]

const NodeSingleton = (() => {
  let instance: oasis.client.NodeInternal

  return {
    getInstance: () => {
      if (!instance) {
        instance = new oasis.client.NodeInternal(GRPC_URL)
      }
      return instance
    },
  }
})()

const DelegationsQueryWrapperSingleton = (() => {
  let instance: oasisRT.wrapper.QueryWrapper<DelegationsQueryWrapperArgs, DelegationsQueryWrapperResponse>

  return {
    getInstance: () => {
      if (!instance) {
        instance = new oasisRT.wrapper.QueryWrapper<
          DelegationsQueryWrapperArgs,
          DelegationsQueryWrapperResponse
        >(oasis.misc.fromHex(PARATIME_RUNTIME_ID), CONSENSUS_DELEGATIONS)
      }
      return instance
    },
  }
})()

const UndelegationsQueryWrapperSingleton = (() => {
  let instance: oasisRT.wrapper.QueryWrapper<UndelegationsQueryWrapperArgs, UndelegationsQueryWrapperResponse>

  return {
    getInstance: () => {
      if (!instance) {
        instance = new oasisRT.wrapper.QueryWrapper<
          UndelegationsQueryWrapperArgs,
          UndelegationsQueryWrapperResponse
        >(oasis.misc.fromHex(PARATIME_RUNTIME_ID), CONSENSUS_UNDELEGATIONS)
      }
      return instance
    },
  }
})()

export const getDelegations = async (
  hexAddress: string,
  node: oasis.client.NodeInternal = NodeSingleton.getInstance()
): Promise<Delegations> => {
  const query = DelegationsQueryWrapperSingleton.getInstance()

  const from = await toSecp256k1eth(hexAddress)
  const delegations = await query.setArgs({ from }).query(node)

  return delegations.map(({ to, shares }) => ({
    to: oasis.staking.addressToBech32(to),
    shares: oasis.quantity.toBigInt(shares),
  }))
}

export const getUndelegations = async (
  hexAddress: string,
  node: oasis.client.NodeInternal = NodeSingleton.getInstance()
): Promise<Undelegations> => {
  const query = UndelegationsQueryWrapperSingleton.getInstance()

  const to = await toSecp256k1eth(hexAddress)
  const undelegations = await query.setArgs({ to }).query(node)

  return undelegations.map(({ from, shares, epoch }) => ({
    from: oasis.staking.addressToBech32(from),
    shares: oasis.quantity.toBigInt(shares),
    epoch: BigInt(epoch),
  }))
}
