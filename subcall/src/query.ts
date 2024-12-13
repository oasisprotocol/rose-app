import { getParaTimeConfig, toSecp256k1eth } from './utils.ts'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { Delegations, ParaTimeChainId, Undelegations } from './types.ts'

type DelegationsQueryWrapperArgs = { from: Uint8Array }
type DelegationsQueryWrapperResponse = { shares: Uint8Array; to: Uint8Array }[]
type UndelegationsQueryWrapperArgs = { to: Uint8Array }
type UndelegationsQueryWrapperResponse = { shares: Uint8Array; from: Uint8Array; epoch: number }[]

const CONSENSUS_DELEGATIONS = 'consensus.Delegations'
const CONSENSUS_UNDELEGATIONS = 'consensus.Undelegations'

export const getDelegations = async (
  paraTimeChainId: ParaTimeChainId,
  hexAddress: string
): Promise<Delegations> => {
  const { paratimeRuntimeId, grpcUrl } = getParaTimeConfig(paraTimeChainId)!

  const from = await toSecp256k1eth(hexAddress)
  const delegations = await new oasisRT.wrapper.QueryWrapper<
    DelegationsQueryWrapperArgs,
    DelegationsQueryWrapperResponse
  >(oasis.misc.fromHex(paratimeRuntimeId), CONSENSUS_DELEGATIONS)
    .setArgs({ from })
    .query(new oasis.client.NodeInternal(grpcUrl))

  return delegations.map(({ to, shares }) => ({
    to: oasis.staking.addressToBech32(to),
    shares: oasis.quantity.toBigInt(shares),
  }))
}

export const getUndelegations = async (
  paraTimeChainId: ParaTimeChainId,
  hexAddress: string
): Promise<Undelegations> => {
  const { paratimeRuntimeId, grpcUrl } = getParaTimeConfig(paraTimeChainId)!

  const to = await toSecp256k1eth(hexAddress)
  const undelegations = await new oasisRT.wrapper.QueryWrapper<
    UndelegationsQueryWrapperArgs,
    UndelegationsQueryWrapperResponse
  >(oasis.misc.fromHex(paratimeRuntimeId), CONSENSUS_UNDELEGATIONS)
    .setArgs({ to })
    .query(new oasis.client.NodeInternal(grpcUrl))

  return undelegations.map(({ from, shares, epoch }) => ({
    from: oasis.staking.addressToBech32(from),
    shares: oasis.quantity.toBigInt(shares),
    epoch: BigInt(epoch),
  }))
}
