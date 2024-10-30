import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { multiplyConsensusToSapphire, oasisConfig, sapphireConfig } from '../utils/oasisConfig'

/**
 * Set allowance from consensusAddress to sapphireConfig.mainnet.address (step 1 of depositing)
 */
export async function depositToSapphireStep1(props: {
  amountToDeposit: bigint
  consensusAddress: `oasis1${string}`
  consensusSigner: oasis.signature.NaclSigner
  sapphireAddress: `0x${string}`
}) {
  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const existingAllowance = oasis.quantity.toBigInt(
    await nic.stakingAllowance({
      owner: oasis.staking.addressFromBech32(props.consensusAddress),
      beneficiary: oasis.staking.addressFromBech32(sapphireConfig.mainnet.address),
      height: oasis.consensus.HEIGHT_LATEST,
    }),
  )
  console.log('existingAllowance', existingAllowance)
  if (existingAllowance >= props.amountToDeposit) return

  const chainContext = await nic.consensusGetChainContext()
  const tw = oasis.staking
    .allowWrapper()
    .setNonce(await getConsensusNonce(props.consensusAddress))
    .setFeeAmount(oasis.quantity.fromBigInt(0n)) // TODO: assumes consensus txs are free
    .setBody({
      beneficiary: oasis.staking.addressFromBech32(sapphireConfig.mainnet.address),
      negative: false,
      amount_change: oasis.quantity.fromBigInt(props.amountToDeposit - existingAllowance),
    })
  tw.setFeeGas(await tw.estimateGas(nic, props.consensusSigner.public()))
  await tw.sign(new oasis.signature.BlindContextSigner(props.consensusSigner), chainContext)
  console.log('depositToSapphireStep1', props.amountToDeposit)
  await tw.submit(nic)
}

/**
 * Deposit from consensusAddress into sapphireAddress (step 2 of depositing)
 */
export async function depositToSapphireStep2(props: {
  amountToDeposit: bigint
  consensusAddress: `oasis1${string}`
  consensusSigner: oasis.signature.NaclSigner
  sapphireAddress: `0x${string}`
}) {
  if (props.amountToDeposit <= 0n) return
  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const chainContext = await nic.consensusGetChainContext()
  const rtw = new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(sapphireConfig.mainnet.runtimeId))
    .callDeposit()
    .setBody({
      amount: [
        oasis.quantity.fromBigInt(props.amountToDeposit * multiplyConsensusToSapphire),
        oasisRT.token.NATIVE_DENOMINATION,
      ],
      // No need for intermediate account to transfer from when depositing to an account user has control over.
      to: oasis.staking.addressFromBech32(await getEvmBech32Address(props.sapphireAddress)),
    })
    .setFeeAmount([oasis.quantity.fromBigInt(0n), oasisRT.token.NATIVE_DENOMINATION]) // TODO: assumes consensus txs are free and deposits full amount
    .setFeeConsensusMessages(1)
    .setSignerInfo([
      {
        address_spec: {
          signature: { ed25519: props.consensusSigner.public() },
        },
        nonce: await getSapphireNonce(props.consensusAddress),
      },
    ])

  rtw.setFeeGas(
    await new oasisRT.core.Wrapper(oasis.misc.fromHex(sapphireConfig.mainnet.runtimeId))
      .queryEstimateGas()
      .setArgs({ tx: rtw.transaction })
      .query(nic),
  )
  await rtw.sign([new oasis.signature.BlindContextSigner(props.consensusSigner)], chainContext)
  console.log('depositToSapphireStep2', props.amountToDeposit)
  await rtw.submit(nic)
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

async function getConsensusNonce(oasisAddress: `oasis1${string}`) {
  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const nonce =
    (await nic.consensusGetSignerNonce({
      account_address: oasis.staking.addressFromBech32(oasisAddress),
      height: 0,
    })) ?? 0
  return nonce
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
