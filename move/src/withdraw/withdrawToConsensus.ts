import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { multiplyConsensusToSapphire, oasisConfig, sapphireConfig } from '../utils/oasisConfig'
import { SapphireAccount } from './useGenerateSapphireAccount'

export async function withdrawToConsensus(props: {
  availableAmountToWithdraw: bigint
  sapphireAccount: SapphireAccount
  consensusAddress: `oasis1${string}`
}) {
  if (props.availableAmountToWithdraw <= 0n) return
  const feeAmount = sapphireConfig.gasPrice * sapphireConfig.feeGas * multiplyConsensusToSapphire
  const amountToWithdraw = roundTo9Decimals(props.availableAmountToWithdraw - feeAmount)

  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const chainContext = await nic.consensusGetChainContext()
  const rtw = new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(sapphireConfig.mainnet.runtimeId))
    .callWithdraw()
    .setBody({
      amount: [oasis.quantity.fromBigInt(amountToWithdraw), oasisRT.token.NATIVE_DENOMINATION],
      to: oasis.staking.addressFromBech32(props.consensusAddress),
    })
    .setFeeAmount([oasis.quantity.fromBigInt(feeAmount), oasisRT.token.NATIVE_DENOMINATION])
    .setFeeGas(sapphireConfig.feeGas)
    .setFeeConsensusMessages(1)
    .setSignerInfo([
      {
        address_spec: {
          signature: { secp256k1eth: props.sapphireAccount.signer.public() },
        },
        nonce: await getSapphireNonce(await getEvmBech32Address(props.sapphireAccount.address)),
      },
    ])
  await rtw.sign([new oasis.signature.BlindContextSigner(props.sapphireAccount.signer)], chainContext)
  console.log('withdrawToConsensus', props.availableAmountToWithdraw)
  await rtw.submit(nic)
}

/**
 * If you try to withdraw 1.234567891234567891 ROSE it throws "amount not representable".
 * Round to 1.234567891000000000 ROSE
 */
function roundTo9Decimals(amount: bigint) {
  return (amount / multiplyConsensusToSapphire) * multiplyConsensusToSapphire
}

async function getEvmBech32Address(evmAddress: `0x${string}`) {
  const evmBytes = oasis.misc.fromHex(evmAddress.replace('0x', ''))
  const address = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    evmBytes,
  )
  const bech32Address = oasisRT.address.toBech32(address) as `oasis1${string}`
  return bech32Address
}

async function getSapphireNonce(oasisAddress: `oasis1${string}`) {
  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const accountsWrapper = new oasisRT.accounts.Wrapper(oasis.misc.fromHex(sapphireConfig.mainnet.runtimeId))
  const nonce = await accountsWrapper
    .queryNonce()
    .setArgs({ address: oasis.staking.addressFromBech32(oasisAddress) })
    .query(nic)
  return nonce
}
