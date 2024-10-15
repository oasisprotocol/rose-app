import { ABI_CODER, getParaTimeConfig } from './utils.ts'
import * as cborg from 'cborg'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { TransactionRequest } from 'ethers'
import { ParaTimeChainId } from './types.ts'

export const consensusDelegate = (
  paraTimeChainId: ParaTimeChainId,
  to: string,
  stakeAmount: bigint
): TransactionRequest => {
  const { subcallAddress } = getParaTimeConfig(paraTimeChainId)!

  const data = ABI_CODER.encode(
    ['string', 'bytes'],
    [
      'consensus.Delegate',
      cborg.encode({
        amount: [oasis.quantity.fromBigInt(stakeAmount), oasisRT.token.NATIVE_DENOMINATION],
        to: oasis.staking.addressFromBech32(to),
      }),
    ]
  )

  return {
    to: subcallAddress,
    data,
  }
}

export const consensusUndelegate = (
  paraTimeChainId: ParaTimeChainId,
  from: string,
  shares: bigint
): TransactionRequest => {
  const { subcallAddress } = getParaTimeConfig(paraTimeChainId)!

  const data = ABI_CODER.encode(
    ['string', 'bytes'],
    [
      'consensus.Undelegate',
      cborg.encode({
        shares: oasis.quantity.fromBigInt(shares),
        from: oasis.staking.addressFromBech32(from),
      }),
    ]
  )

  return {
    to: subcallAddress,
    data,
  }
}
