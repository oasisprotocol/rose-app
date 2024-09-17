import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import BigNumber from 'bignumber.js'
import { consensusConfig, oasisConfig, sapphireConfig } from './oasisConfig'

export async function getBalances(props: { consensusAddress: `oasis1${string}`; sapphireAddress: `0x${string}` }) {
  const consensus = await getConsensusBalance(props.consensusAddress)
  const sapphire = await getSapphireBalance(props.sapphireAddress)
  return { consensus, sapphire }
}

/** Continuously fetches gRPC balance until it is > minBalance */
export async function waitForConsensusBalance(consensusAddress: `oasis1${string}`, moreThan: bigint) {
  while (true) {
    const balance = await getConsensusBalance(consensusAddress)
    console.log('waitForConsensusBalance', balance, '>', moreThan)
    if (balance.raw > moreThan) return balance
    await new Promise((r) => setTimeout(r, 6000))
    if (window.mock) return balance
  }
}

/** Continuously fetches gRPC balance until it is > minBalance */
export async function waitForSapphireBalance(sapphireAddress: `0x${string}`, moreThan: bigint) {
  while (true) {
    const balance = await getSapphireBalance(sapphireAddress)
    console.log('waitForSapphireBalance', balance, '>', moreThan)
    if (balance.raw > moreThan) return balance
    await new Promise((r) => setTimeout(r, 6000))
    if (window.mock) return balance
  }
}

export async function getConsensusBalance(oasisAddress: `oasis1${string}`) {
  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const owner = oasis.staking.addressFromBech32(oasisAddress)
  const account = await nic.stakingAccount({ height: oasis.consensus.HEIGHT_LATEST, owner: owner })
  const isFresh = !account.general?.nonce // undefined || <=0 || <=0n
  const balance = oasis.quantity.toBigInt(account.general?.balance ?? new Uint8Array([0]))
  return {
    raw: balance,
    formatted: fromBaseUnits(balance, consensusConfig.decimals),
    isFresh: isFresh,
  }
}

export async function getSapphireBalance(ethAddress: `0x${string}`) {
  const nic = new oasis.client.NodeInternal(oasisConfig.mainnet.grpc)
  const consensusWrapper = new oasisRT.consensusAccounts.Wrapper(oasis.misc.fromHex(sapphireConfig.mainnet.runtimeId))
  const underlyingAddress = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    oasis.misc.fromHex(ethAddress.replace('0x', '')),
  )

  const balanceResult = await consensusWrapper
    .queryBalance()
    .setArgs({
      address: underlyingAddress,
    })
    .query(nic)
  const balance = oasis.quantity.toBigInt(balanceResult.balance)
  return {
    raw: balance,
    formatted: fromBaseUnits(balance, sapphireConfig.decimals),
  }
}

function fromBaseUnits(valueInBaseUnits: bigint, decimals: number): string {
  const value = new BigNumber(valueInBaseUnits.toString()).shiftedBy(-decimals) // / 10 ** decimals
  if (value.isNaN()) {
    throw new Error(`Not a number in fromBaseUnits(${valueInBaseUnits})`)
  }
  return value.toFixed()
}
