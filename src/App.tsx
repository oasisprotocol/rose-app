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
  const [progress, setProgress] = useState({ percentage: 0 as number | undefined, message: '' })
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
    blockNavigatingAway() // Start blocking early for the first transfer
    await step3(consensusAccount, sapphireAddress)
  }
  async function step3(consensusAccount: ConsensusAccount, sapphireAddress: `0x${string}`) {
    // Note: don't use outside state vars. They are outdated.
    try {
      setProgress({ percentage: 0.05, message: 'Awaiting ROSE transfer…' })
      const amountToDeposit = await waitForConsensusBalance(consensusAccount.address, 0n)
      setProgress({ percentage: 0.25, message: `${amountToDeposit.formatted} ROSE detected` })
      blockNavigatingAway()
      await depositToSapphireStep1({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.5, message: `${amountToDeposit.formatted} ROSE detected (updated allowance)` })
      const preDepositSapphireBalance = await getSapphireBalance(sapphireAddress)
      await depositToSapphireStep2({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.75, message: `${amountToDeposit.formatted} ROSE detected (sent deposit)` })
      await waitForSapphireBalance(sapphireAddress, preDepositSapphireBalance.raw)
      setProgress({
        percentage: 1.0,
        message: `${amountToDeposit.formatted} deposited (balance changed)`,
      })
      allowNavigatingAway() // Stop blocking unless new transfer comes in
      await updateBalanceInsideConnectButton()

      await new Promise((r) => setTimeout(r, 6000))
      // Stay on "Deposited" screen unless new transfer comes in
      await waitForConsensusBalance(consensusAccount.address, 0n)
    } catch (err) {
      console.error(err)
      setProgress({ percentage: undefined, message: `Error. Retrying` })
      await new Promise((r) => setTimeout(r, 6000))
    } finally {
      allowNavigatingAway()
    }

    // Loop
    await step3(consensusAccount, sapphireAddress)
  }

  if (!sapphireAddress) {
    return (
      <div>
        <p style={{ maxWidth: '670px' }}>
          The Rose (on)ramp dApp has been built by Oasis to offer users an easy to use service of moving your Rose from
          any centralized exchange to Sapphire (Metamask), without having to handle a Rose Wallet. Connect below and
          follow the steps to complete your transfer.
        </p>
        {/* step1 */}
        <ConnectButton />
      </div>
    )
  }
  if (!consensusAccount) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ConnectButton />
        </div>

        <p>Consensus to Sapphire</p>
        <button type="button" onClick={step2}>
          Select and sign-in
        </button>

        <p>Sapphire to Consensus</p>
        <button type="button" disabled>
          Coming soon
        </button>
      </div>
    )
  }
  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ConnectButton />
        </div>

        <h2>Address created and awaiting your transfer</h2>
        <p style={{ maxWidth: '670px' }}>
          Use the generated address below to initiate the transfer on your centralized exchange. The dApp automatically
          recognizes your transfer form the centralized exchange and will track it.
        </p>

        <div>
          Your address &nbsp;
          <AccountAvatar diameter={24} account={{ address: consensusAccount.address }} />
          {consensusAccount.address}
          &nbsp;
          <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.address)}>
            Copy address &#x2398;
          </button>
          &nbsp;
          <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.privateKey)}>
            Copy private key &#x2398;
          </button>
        </div>
        <br />
        <br />
        {progress.message}
        <br />
        <progress id="file" value={progress.percentage} max={1} style={{ width: '30vw', height: '32px' }} />
        <br />
        <br />
        <br />
        <br />

        <p style={{ maxWidth: '670px' }}>
          Please do not close this window in order to complete the process. If the window is closed you can always
          recover from the last step and your funds won't be lost.
        </p>
      </div>
    </div>
  )
}

export default App
