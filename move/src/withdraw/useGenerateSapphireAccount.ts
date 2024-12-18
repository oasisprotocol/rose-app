import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'
import { useState } from 'react'
import { hexToBytes } from 'viem'
import { privateKeyToAddress } from 'viem/accounts'
import { useSignMessage } from 'wagmi'
import { getConsensusBalance } from '../utils/getBalances'
import { siweMessageSapphireToConsensus } from './siweMessageSapphireToConsensus'

export interface ConsensusAccount {
  address: `oasis1${string}`
  privateKey: string
  signer: oasis.signature.NaclSigner
  isFresh: boolean
}

export interface SapphireAccount {
  address: `0x${string}`
  privateKey: `0x${string}`
  signer: oasis.signature.NaclSigner
}

export function useGenerateSapphireAccount() {
  const { signMessageAsync } = useSignMessage()
  const [generatedConsensusAccount, setGeneratedConsensusAccount] = useState<ConsensusAccount>()
  const [generatedSapphireAccount, setGeneratedSapphireAccount] = useState<SapphireAccount>()

  return {
    generatedSapphireAccount,
    generatedConsensusAccount,
    generateSapphireAccount: async (sapphireAddress: `0x${string}`) => {
      const signature = await signMessageAsync({
        message: siweMessageSapphireToConsensus(sapphireAddress),
      })
      const hashedSignature = await window.crypto.subtle.digest('SHA-512', hexToBytes(signature))

      const sapphireAccount = await (async () => {
        // Only take half
        const seed32bytes = new Uint8Array(hashedSignature.slice(0, hashedSignature.byteLength / 2))
        if (seed32bytes.length !== 32) throw new Error('Unexpected derived private key length')
        const signer = oasisRT.signatureSecp256k1.EllipticSigner.fromPrivate(
          seed32bytes,
          'this key is not important'
        )
        const privateKey = `0x${signer.key.getPrivate('hex')}` as `0x${string}`
        const address = privateToEthAddress(privateKey)
        return { address, privateKey, signer }
      })()

      const consensusAccount = await (async () => {
        // Take other half
        const seed32bytes = new Uint8Array(hashedSignature.slice(hashedSignature.byteLength / 2))
        if (seed32bytes.length !== 32) throw new Error('Unexpected derived private key length')
        const signer = oasis.signature.NaclSigner.fromSeed(seed32bytes, 'this key is not important')
        const privateKey = oasis.misc.toBase64(signer.key.secretKey)
        const address = await oasisPublicKeyToAddress(signer.public())
        const { isFresh } = await getConsensusBalance(address)
        return { address, privateKey, signer, isFresh }
      })()

      setGeneratedSapphireAccount(sapphireAccount)
      setGeneratedConsensusAccount(consensusAccount)
      return {
        generatedSapphireAccount: sapphireAccount,
        generatedConsensusAccount: consensusAccount,
      }
      // Ignore errors
    },
  }
}

async function oasisPublicKeyToAddress(publicKey: Uint8Array) {
  const data = await oasis.staking.addressFromPublicKey(publicKey)
  return oasis.staking.addressToBech32(data) as `oasis1${string}`
}

const privateToEthAddress = privateKeyToAddress
