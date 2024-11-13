import { getParaTimeConfig } from './utils.ts'
import * as cborg from 'cborg'
import { AbiParameter, bytesToHex, encodeAbiParameters, TransactionRequest } from 'viem'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { ParaTimeChainId } from './types.ts'

export const consensusDelegate = (
  paraTimeChainId: ParaTimeChainId,
  to: string,
  stakeAmount: bigint
): TransactionRequest => {
  const { subcallAddress } = getParaTimeConfig(paraTimeChainId)!

  const types: AbiParameter[] = [{ type: 'string' }, { type: 'bytes' }]
  const values: [string, `0x${string}`] = [
    'consensus.Delegate',
    bytesToHex(
      cborg.encode({
        amount: [oasis.quantity.fromBigInt(stakeAmount), oasisRT.token.NATIVE_DENOMINATION],
        to: oasis.staking.addressFromBech32(to),
      })
    ),
  ]

  const data = encodeAbiParameters(types, values)

  return {
    to: subcallAddress as `0x${string}`,
    data,
  }
}

export const consensusUndelegate = (
  paraTimeChainId: ParaTimeChainId,
  from: string,
  shares: bigint
): TransactionRequest => {
  const { subcallAddress } = getParaTimeConfig(paraTimeChainId)!

  const types: AbiParameter[] = [{ type: 'string' }, { type: 'bytes' }]
  const values: [string, `0x${string}`] = [
    'consensus.Undelegate',
    bytesToHex(
      cborg.encode({
        shares: oasis.quantity.fromBigInt(shares),
        from: oasis.staking.addressFromBech32(from),
      })
    ),
  ]

  const data = encodeAbiParameters(types, values)

  return {
    to: subcallAddress as `0x${string}`,
    data,
  }
}
