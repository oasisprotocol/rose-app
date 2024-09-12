import { toSecp256k1eth } from './utils.ts'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { Delegations, Undelegations } from './types.ts'

type DelegationsQueryWrapperArgs = { from: Uint8Array }
type DelegationsQueryWrapperResponse = { shares: Uint8Array; to: Uint8Array }[]
type UndelegationsQueryWrapperArgs = { to: Uint8Array }
type UndelegationsQueryWrapperResponse = { shares: Uint8Array; from: Uint8Array; epoch: number }[]

const PARATIME_RUNTIME_ID = import.meta.env.VITE_PARATIME_RUNTIME_ID
const GRPC_URL = import.meta.env.VITE_GRPC_URL

const CONSENSUS_DELEGATIONS = 'consensus.Delegations'
const CONSENSUS_UNDELEGATIONS = 'consensus.Undelegations'

const nodeInternal = new oasis.client.NodeInternal(GRPC_URL)

export const getDelegations = async (
  hexAddress: string,
  node: oasis.client.NodeInternal = nodeInternal
): Promise<Delegations> => {
  const from = await toSecp256k1eth(hexAddress)
  const delegations = await new oasisRT.wrapper.QueryWrapper<
    DelegationsQueryWrapperArgs,
    DelegationsQueryWrapperResponse
  >(oasis.misc.fromHex(PARATIME_RUNTIME_ID), CONSENSUS_DELEGATIONS)
    .setArgs({ from })
    .query(node)

  return delegations.map(({ to, shares }) => ({
    to: oasis.staking.addressToBech32(to),
    shares: oasis.quantity.toBigInt(shares),
  }))
}

export const getUndelegations = async (
  hexAddress: string,
  node: oasis.client.NodeInternal = nodeInternal
): Promise<Undelegations> => {
  const to = await toSecp256k1eth(hexAddress)
  const undelegations = await new oasisRT.wrapper.QueryWrapper<
    UndelegationsQueryWrapperArgs,
    UndelegationsQueryWrapperResponse
  >(oasis.misc.fromHex(PARATIME_RUNTIME_ID), CONSENSUS_UNDELEGATIONS)
    .setArgs({ to })
    .query(node)

  return undelegations.map(({ from, shares, epoch }) => ({
    from: oasis.staking.addressToBech32(from),
    shares: oasis.quantity.toBigInt(shares),
    epoch: BigInt(epoch),
  }))
}
