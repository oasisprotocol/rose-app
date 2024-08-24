import { useState } from 'react'
import { hexToBytes } from 'viem'
import { useSignMessage } from 'wagmi'
import { siweMessageConsensusToSapphire } from './siweMessageConsensusToSapphire'

function toBase64(u8: Uint8Array) {
  return btoa(String.fromCharCode(...u8))
}

export function useGenerateConsensusAccount() {
  const { signMessageAsync } = useSignMessage()
  const [consensusAccount, setConsensusAccount] = useState<{ privateKey: string }>()

  return {
    consensusAccount,
    generateConsensusAccount: async (address: `0x${string}`) => {
      const signature = await signMessageAsync({
        message: siweMessageConsensusToSapphire(address),
      })
      const digest = await window.crypto.subtle.digest('SHA-512', hexToBytes(signature))
      // Only take half
      const privateKey = toBase64(new Uint8Array(digest.slice(digest.byteLength / 2)))
      const account = { privateKey }
      setConsensusAccount(account)
      return account
      // Ignore errors
    },
  }
}
