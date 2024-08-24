import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { useGenerateConsensusAccount } from './utils/useGenerateConsensusAccount'
import { getBalances } from './utils/getBalances'

function App() {
  const latestConnectedSapphireAccount = useAccount()
  const [sapphireAddress, setSapphireAddress] = useState<`0x${string}`>()
  const { consensusAccount, generateConsensusAccount } = useGenerateConsensusAccount()

  useAccountEffect({
    onConnect: (d) => {
      // Only save first connected sapphire account
      setSapphireAddress(d.address)
    },
  })
  useEffect(() => {
    if (sapphireAddress && sapphireAddress !== latestConnectedSapphireAccount.address) {
      // Correctly supporting switching accounts would require rewriting depositing logic into
      // redux-saga to make it cancelable at any step. Cancel by reloading instead.
      window.location.reload()
    }
  }, [sapphireAddress, latestConnectedSapphireAccount.address])

  async function step2() {
    if (sapphireAddress) {
      await generateConsensusAccount(sapphireAddress)
    }
  }

  useEffect(() => {
    if (consensusAccount?.address && sapphireAddress) {
      getBalances({
        consensusAddress: consensusAccount?.address,
        sapphireAddress: sapphireAddress,
      }).then(console.log)
    }
  }, [consensusAccount?.address, sapphireAddress])

  return (
    <>
      <div>
        <h1>Step 1</h1>
        <ConnectButton />
      </div>

      <div>
        <h2>Step 2</h2>
        <button type="button" onClick={step2}>
          Select and sign-in
        </button>

        {consensusAccount && (
          <div>
            {consensusAccount.address}
            <br />
            Private key: <input type="text" readOnly value={consensusAccount.privateKey}></input>
            <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.privateKey)}>
              &#x2398;
            </button>
            <br />
            Awaiting transfer
          </div>
        )}
      </div>
    </>
  )
}

export default App
