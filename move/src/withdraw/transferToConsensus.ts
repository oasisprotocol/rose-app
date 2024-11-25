import * as oasis from '@oasisprotocol/client'
import { ConsensusAccount } from './useGenerateSapphireAccount'

import { getNodeInternal } from '../utils/client.ts'
import { getConsensusNonce } from '../utils/nonce.ts'

export async function transferToConsensus(props: {
  amount: bigint
  fromConsensusAccount: ConsensusAccount
  toConsensusAddress: `oasis1${string}`
}) {
  if (props.amount <= 0n) return
  const nic = getNodeInternal()
  const chainContext = await nic.consensusGetChainContext()
  const tw = oasis.staking
    .transferWrapper()
    .setNonce(await getConsensusNonce(props.fromConsensusAccount.address))
    .setFeeAmount(oasis.quantity.fromBigInt(0n)) // TODO: assumes consensus txs are free
    .setBody({
      to: oasis.staking.addressFromBech32(props.toConsensusAddress),
      amount: oasis.quantity.fromBigInt(props.amount),
    })
  tw.setFeeGas(await tw.estimateGas(nic, props.fromConsensusAccount.signer.public()))
  await tw.sign(new oasis.signature.BlindContextSigner(props.fromConsensusAccount.signer), chainContext)
  console.log('transferToConsensus', props.amount)
  await tw.submit(nic)
}
