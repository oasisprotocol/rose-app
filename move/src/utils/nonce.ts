import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { getNodeInternal } from './client.ts'
import { sapphireConfig } from './oasisConfig.ts'
import { retry } from './retry.ts'

const { PROD } = import.meta.env

function checkNonce(nonce: oasis.types.longnum, lastKnownNonce: oasis.types.longnum) {
  if (!nonce) return 0

  if (!lastKnownNonce) return nonce
  else if (lastKnownNonce >= nonce) throw new Error('Existing nonce bigger than retrieved nonce!')

  return nonce
}

async function _getConsensusNonce(oasisAddress: `oasis1${string}`) {
  const nic = getNodeInternal()
  const nonce =
    (await nic.consensusGetSignerNonce({
      account_address: oasis.staking.addressFromBech32(oasisAddress),
      height: 0,
    })) ?? 0
  return nonce
}

const consensusLastKnownNonce: { [address: `oasis1${string}`]: oasis.types.longnum } = {}

async function getConsensusNonce(oasisAddress: `oasis1${string}`) {
  const lastKnownNonce = consensusLastKnownNonce[oasisAddress] ?? null

  const newNonce = await retry(_getConsensusNonce(oasisAddress), (nonce) => checkNonce(nonce, lastKnownNonce))

  consensusLastKnownNonce[oasisAddress] = newNonce
  return newNonce
}

async function _getSapphireNonce(oasisAddress: `oasis1${string}`) {
  const nic = getNodeInternal()
  const accountsWrapper = new oasisRT.accounts.Wrapper(
    oasis.misc.fromHex(PROD ? sapphireConfig.mainnet.runtimeId : sapphireConfig.testnet.runtimeId),
  )
  const nonce = await accountsWrapper
    .queryNonce()
    .setArgs({ address: oasis.staking.addressFromBech32(oasisAddress) })
    .query(nic)
  return nonce
}

const sapphireLastKnownNonce: { [address: `oasis1${string}`]: oasis.types.longnum } = {}

async function getSapphireNonce(oasisAddress: `oasis1${string}`) {
  const lastKnownNonce = sapphireLastKnownNonce[oasisAddress] ?? null

  const newNonce = await retry(_getSapphireNonce(oasisAddress), (nonce) => checkNonce(nonce, lastKnownNonce))

  sapphireLastKnownNonce[oasisAddress] = newNonce
  return newNonce
}

export { getConsensusNonce, getSapphireNonce }
