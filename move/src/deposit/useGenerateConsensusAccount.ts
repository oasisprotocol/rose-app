import * as oasis from '@oasisprotocol/client'
import { useState } from 'react'
import { hexToBytes } from 'viem'
import { useSignMessage } from 'wagmi'
import { getConsensusBalance } from '../utils/getBalances'
import { siweMessageConsensusToSapphire } from './siweMessageConsensusToSapphire'

export interface ConsensusAccount {
  address: `oasis1${string}`
  privateKey: string
  signer: oasis.signature.NaclSigner
  isFresh: boolean
}

export function useGenerateConsensusAccount() {
  const { signMessageAsync } = useSignMessage()
  const [generatedConsensusAccount, setGeneratedConsensusAccount] = useState<ConsensusAccount>()

  return {
    generatedConsensusAccount,
    generateConsensusAccount: async (sapphireAddress: `0x${string}`) => {
      const signature = await signMessageAsync({
        message: siweMessageConsensusToSapphire(sapphireAddress),
      })
      const hashedSignature = await window.crypto.subtle.digest(
        'SHA-512',
        hexToBytes(signature) as Uint8Array<ArrayBuffer>
      )
      // Only take half
      const seed32bytes = new Uint8Array(hashedSignature.slice(0, hashedSignature.byteLength / 2))
      if (seed32bytes.length !== 32) throw new Error('Unexpected derived private key length')
      const signer = oasis.signature.NaclSigner.fromSeed(seed32bytes, 'this key is not important')
      const privateKey = oasis.misc.toBase64(signer.key.secretKey)
      const address = await oasisPublicKeyToAddress(signer.public())
      const { isFresh } = await getConsensusBalance(address)

      const consensusAccount = { address, privateKey, signer, isFresh }
      setGeneratedConsensusAccount(consensusAccount)
      return consensusAccount
      // Ignore errors
    },
  }
}

async function oasisPublicKeyToAddress(publicKey: Uint8Array) {
  const data = await oasis.staking.addressFromPublicKey(publicKey)
  return oasis.staking.addressToBech32(data) as `oasis1${string}`
}
