import { getParaTimeConfig } from './utils.ts'
import { TransactionRequest } from 'viem'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { ParaTimeChainId } from './types.ts'

export const consensusDelegate = (
  paraTimeChainId: ParaTimeChainId,
  to: string,
  stakeAmount: bigint
): TransactionRequest => {
  const { paratimeRuntimeId } = getParaTimeConfig(paraTimeChainId)!

  return new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(paratimeRuntimeId))
    .callDelegate()
    .setBody({
      amount: [oasis.quantity.fromBigInt(stakeAmount), oasisRT.token.NATIVE_DENOMINATION],
      to: oasis.staking.addressFromBech32(to),
    })
    .toSubcall()
}

export const consensusUndelegate = (
  paraTimeChainId: ParaTimeChainId,
  from: string,
  shares: bigint
): TransactionRequest => {
  const { paratimeRuntimeId } = getParaTimeConfig(paraTimeChainId)!

  return new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(paratimeRuntimeId))
    .callUndelegate()
    .setBody({
      shares: oasis.quantity.fromBigInt(shares),
      from: oasis.staking.addressFromBech32(from),
    })
    .toSubcall()
}
