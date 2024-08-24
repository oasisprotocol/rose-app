import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount, useAccountEffect } from 'wagmi'
import { getBalances, waitForConsensusBalance } from './utils/getBalances'
import { useGenerateConsensusAccount } from './utils/useGenerateConsensusAccount'

function App() {
  const latestConnectedSapphireAccount = useAccount()
  const [sapphireAddress, setSapphireAddress] = useState<`0x${string}`>()
  const { consensusAccount, generateConsensusAccount } = useGenerateConsensusAccount()
  const [progress, setProgress] = useState({ percentage: 0, message: '' })

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

  // Long running promise, doesn't get canceled if this component is destroyed
  async function step2() {
    if (!sapphireAddress) return
    const consensusAccount = await generateConsensusAccount(sapphireAddress)
    // TODO: extract so can't consume outdated state vars
    setProgress({ percentage: 0.05, message: 'Awaiting ROSE transfer…' })
    const amountToDeposit = await waitForConsensusBalance(consensusAccount.address, 0n)
    setProgress({ percentage: 0.25, message: `${amountToDeposit.formatted} ROSE detected` })
    const balances = await getBalances({
      consensusAddress: consensusAccount.address,
      sapphireAddress: sapphireAddress,
    })
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
            {consensusAccount.address}
            <br />
            Private key: <input type="text" readOnly value={consensusAccount.privateKey}></input>
            <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.privateKey)}>
              &#x2398;
            </button>
            <br />
          </div>
        )}
      </div>
      <div>
        <h2>Progress</h2>
        {progress.percentage}
        <br />
        {progress.message}
      </div>
    </>
  )
}

export default App
