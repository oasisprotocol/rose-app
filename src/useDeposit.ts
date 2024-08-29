import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { depositToSapphireStep1, depositToSapphireStep2 } from './utils/depositToSapphire'
import { getSapphireBalance, waitForConsensusBalance, waitForSapphireBalance } from './utils/getBalances'
import { useBlockNavigatingAway } from './utils/useBlockNavigatingAway'
import { ConsensusAccount, useGenerateConsensusAccount } from './utils/useGenerateConsensusAccount'

export function useDeposit() {
  const { isBlockingNavigatingAway, blockNavigatingAway, allowNavigatingAway } = useBlockNavigatingAway()
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
      setProgress({ percentage: 0.5, message: `Depositing ${amountToDeposit.formatted} ROSE` })
      const preDepositSapphireBalance = await getSapphireBalance(sapphireAddress)
      await depositToSapphireStep2({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.75, message: `Depositing ${amountToDeposit.formatted} ROSE` })
      await waitForSapphireBalance(sapphireAddress, preDepositSapphireBalance.raw)
      // TODO: handle probable failure if balance doesn't change after ~10 seconds of depositing
      setProgress({
        percentage: 1.0,
        message: `${amountToDeposit.formatted} ROSE deposited`,
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

  return {
    sapphireAddress,
    consensusAccount,
    step2,
    progress,
    isBlockingNavigatingAway,
  }
}
