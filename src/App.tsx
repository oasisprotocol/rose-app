import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { AccountAvatar } from './components/AccountAvatar'
import { allowNavigatingAway, blockNavigatingAway } from './utils/blockNavigatingAway'
import { depositToSapphireStep1, depositToSapphireStep2 } from './utils/depositToSapphire'
import { getSapphireBalance, waitForConsensusBalance, waitForSapphireBalance } from './utils/getBalances'
import { ConsensusAccount, useGenerateConsensusAccount } from './utils/useGenerateConsensusAccount'

function App() {
  const latestConnectedSapphireAccount = useAccount()
  const [sapphireAddress, setSapphireAddress] = useState<`0x${string}`>()
  const { consensusAccount, generateConsensusAccount } = useGenerateConsensusAccount()
  const [progress, setProgress] = useState({ percentage: 0, message: '' })
  const { refetch: updateBalanceInsideConnectButton } = useBalance({ address: sapphireAddress })

  useEffect(() => {
    if (latestConnectedSapphireAccount.address && !sapphireAddress) {
      // Only save first connected sapphire account
      setSapphireAddress(latestConnectedSapphireAccount.address)
    }
  }, [sapphireAddress, latestConnectedSapphireAccount.address])

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
    await step3(consensusAccount, sapphireAddress)
  }
  async function step3(consensusAccount: ConsensusAccount, sapphireAddress: `0x${string}`) {
    // Note: don't use outside state vars. They are outdated.
    try {
      blockNavigatingAway()
      setProgress({ percentage: 0.05, message: 'Awaiting ROSE transfer…' })
      const amountToDeposit = await waitForConsensusBalance(consensusAccount.address, 0n)
      setProgress({ percentage: 0.25, message: `${amountToDeposit.formatted} ROSE detected` })
      await depositToSapphireStep1({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.5, message: `${amountToDeposit.formatted} ROSE detected (set allowance)` })
      const preDepositSapphireBalance = await getSapphireBalance(sapphireAddress)
      await depositToSapphireStep2({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.75, message: `${amountToDeposit.formatted} ROSE detected (submit deposit)` })
      await waitForSapphireBalance(sapphireAddress, preDepositSapphireBalance.raw)
      setProgress({
        percentage: 1.0,
        message: `${amountToDeposit.formatted} deposited (balance changed, event didn't error)`,
      })
      allowNavigatingAway()
      await updateBalanceInsideConnectButton()
      // Stay on "Deposited" screen unless new transfer comes in
      await waitForConsensusBalance(consensusAccount.address, 0n)
    } catch (err) {
      console.error(err)
      setProgress({ percentage: 0.1, message: `Error. Retrying` })
    } finally {
      allowNavigatingAway()
    }

    // Loop
    await new Promise((r) => setTimeout(r, 6000))
    await step3(consensusAccount, sapphireAddress)
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
            <AccountAvatar diameter={24} account={{ address: consensusAccount.address }} />
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
