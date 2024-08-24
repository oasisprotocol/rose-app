import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { useGenerateConsensusAccount } from './utils/useGenerateConsensusAccount'

function App() {
  const latestConnectedAccount = useAccount()
  const [firstConnectedAccount, setFirstConnectedAccount] = useState<`0x${string}`>()
  const { consensusAccount, generateConsensusAccount } = useGenerateConsensusAccount()

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

  async function step2() {
    if (firstConnectedAccount) {
      await generateConsensusAccount(firstConnectedAccount)
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
        <button type="button" onClick={step2}>
          Select and sign-in
        </button>

        {consensusAccount && (
          <div>
            Secret: <input type="text" readOnly value={consensusAccount.privateKey}></input>
            <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.privateKey)}>
              &#x2398;
            </button>
            <br />
          </div>
        )}
      </div>
    </>
  )
}

export default App
