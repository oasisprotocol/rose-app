import { ABI_CODER } from './utils.ts'
import * as cborg from 'cborg'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { TransactionRequest } from 'ethers'

const SUBCALL_ADDRESS = import.meta.env.VITE_SUBCALL_ADDRESS

export const consensusDelegate = (to: string, stakeAmount: bigint): TransactionRequest => {
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
    to: SUBCALL_ADDRESS,
    data,
  }
}

export const consensusUndelegate = (from: string, shares: bigint): TransactionRequest => {
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
    to: SUBCALL_ADDRESS,
    data,
  }
}
