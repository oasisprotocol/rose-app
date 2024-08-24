import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { bytesToHex, hexToBytes } from 'viem'
import { useAccount, useAccountEffect, useSignMessage } from 'wagmi'
import { siweMessageConsensusToSapphire } from './utils/siweMessageConsensusToSapphire'

function toBase64(u8: Uint8Array) {
  return btoa(String.fromCharCode(...u8))
}

function App() {
  const latestConnectedAccount = useAccount()
  const [firstConnectedAccount, setFirstConnectedAccount] = useState<`0x${string}`>()
  const { signMessageAsync } = useSignMessage()
  const [stakingSecret, setConsensusSecret] = useState<Uint8Array>()

  useAccountEffect({
    onConnect: (d) => {
      setFirstConnectedAccount(d.address)
    },
  })
  useEffect(() => {
    if (firstConnectedAccount && firstConnectedAccount !== latestConnectedAccount.address) {
      // Correctly supporting switching accounts would require rewriting depositing logic into
      // redux-saga to make it cancelable at any step. Cancel by reloading instead.
      window.location.reload()
    }
  }, [firstConnectedAccount, latestConnectedAccount.address])

  // When 'Generate' button is pressed, do SIWE then derive Consensus key
  async function generateKeypair() {
    console.log('generateKeypair for', latestConnectedAccount.address)
    if (latestConnectedAccount.address) {
      const signature = await signMessageAsync({
        message: siweMessageConsensusToSapphire(latestConnectedAccount.address),
      })
      console.log('Signature is', signature)
      const digest = await window.crypto.subtle.digest('SHA-512', hexToBytes(signature))
      console.log('Digest', digest)
      const secret = new Uint8Array(digest)
      if (!stakingSecret || bytesToHex(secret) !== bytesToHex(stakingSecret)) {
        setConsensusSecret(secret)
      }
    }
  }

  function CopyStakingSecret() {
    if (stakingSecret) {
      navigator.clipboard.writeText(toBase64(stakingSecret))
    }
  }

  function GenerateButton() {
    if (stakingSecret) {
      return (
        <div>
          Secret: <input type="text" readOnly value={toBase64(stakingSecret)}></input>
          <button onClick={CopyStakingSecret}>&#x2398;</button>
          <br />
        </div>
      )
    } else {
      return <button onClick={generateKeypair}>Generate</button>
    }
  }

  return (
    <>
      <div>
        <h1>Step 1</h1>

        <ConnectButton />
      </div>

      <div>
        <h2>Step 2</h2>
        <div>
          <button>Switch Chain to Sapphire</button>
        </div>
      </div>

      <div>
        <h2>Step 3</h2>
        <GenerateButton />
      </div>
    </>
  )
}

export default App
