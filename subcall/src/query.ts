import { getParaTimeConfig, toSecp256k1eth } from './utils.ts'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { Delegations, ParaTimeChainId, Undelegations } from './types.ts'

export const getDelegations = async (
  paraTimeChainId: ParaTimeChainId,
  hexAddress: string
): Promise<Delegations> => {
  const { paratimeRuntimeId, grpcUrl } = getParaTimeConfig(paraTimeChainId)!
  const from = await toSecp256k1eth(hexAddress)

  const delegations = await new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(paratimeRuntimeId))
    .queryDelegations()
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
  const undelegations = await new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(paratimeRuntimeId))
    .queryUndelegations()
    .setArgs({ to })
    .query(new oasis.client.NodeInternal(grpcUrl))

  return undelegations.map(({ from, shares, epoch }) => ({
    from: oasis.staking.addressToBech32(from),
    shares: oasis.quantity.toBigInt(shares),
    epoch: BigInt(epoch),
  }))
}
