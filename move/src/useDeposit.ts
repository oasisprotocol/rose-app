import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { depositToSapphireStep1, depositToSapphireStep2 } from './deposit/depositToSapphire'
import { ConsensusAccount, useGenerateConsensusAccount } from './deposit/useGenerateConsensusAccount'
import { getSapphireBalance, waitForConsensusBalance, waitForSapphireBalance } from './utils/getBalances'
import { useBlockNavigatingAway } from './utils/useBlockNavigatingAway'

/** any consensus -> generatedConsensusAccount -> sapphireAddress */
export function useDeposit() {
  const { isBlockingNavigatingAway, blockNavigatingAway, allowNavigatingAway } = useBlockNavigatingAway()
  const sapphireAddress = useAccount().address
  const { generatedConsensusAccount, generateConsensusAccount } = useGenerateConsensusAccount()
  const [progress, setProgress] = useState({ percentage: 0 as number | undefined, message: '' })
  const { refetch: updateBalanceInsideConnectButton } = useBalance({ address: sapphireAddress })

  // Long running promise, doesn't get canceled if this component is destroyed
  async function step2() {
    if (!sapphireAddress) return
    const generatedConsensusAccount = await generateConsensusAccount(sapphireAddress)
    blockNavigatingAway() // Start blocking early for the first transfer
    await step3(generatedConsensusAccount, sapphireAddress)
  }

  async function step3(consensusAccount: ConsensusAccount, sapphireAddress: `0x${string}`) {
    // Note: don't use outside state vars. They are outdated.
    try {
      setProgress({ percentage: 0.05, message: 'Waiting to Move your ROSE…' })
      const amountToDeposit = await waitForConsensusBalance(consensusAccount.address, 0n)
      setProgress({ percentage: 0.25, message: 'ROSE transfer initiated' })
      blockNavigatingAway()
      await depositToSapphireStep1({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.5, message: 'ROSE transfer initiated' })
      const preDepositSapphireBalance = await getSapphireBalance(sapphireAddress)
      await depositToSapphireStep2({
        amountToDeposit: amountToDeposit.raw,
        consensusSigner: consensusAccount.signer,
        consensusAddress: consensusAccount.address,
        sapphireAddress: sapphireAddress,
      })
      setProgress({ percentage: 0.75, message: 'ROSE transfer initiated' })
      await waitForSapphireBalance(sapphireAddress, preDepositSapphireBalance.raw)
      // TODO: handle probable failure if balance doesn't change after ~10 seconds of depositing
      setProgress({
        percentage: 1.0,
        message: 'Your ROSE transfer is complete!',
      })
      allowNavigatingAway() // Stop blocking unless new transfer comes in
      await updateBalanceInsideConnectButton()

      await new Promise((r) => setTimeout(r, 6000))
      // Stay on "Deposited" screen unless new transfer comes in
      await waitForConsensusBalance(consensusAccount.address, 0n)
      if (window.mock) throw 'mock error'
    } catch (err) {
      console.error(err)
      setProgress({ percentage: undefined, message: `Error. Retrying…` })
      await new Promise((r) => setTimeout(r, 6000))
    } finally {
      allowNavigatingAway()
    }

    // Loop
    await step3(consensusAccount, sapphireAddress)
  }

  function transferMore() {
    // Just pretends to be on that step. In reality process is still stuck at
    // waitForConsensusBalance, but if user makes a transfer, it becomes real.
    setProgress({ percentage: 0.05, message: 'Waiting to Move your ROSE…' })
  }

  return {
    sapphireAddress,
    generatedConsensusAccount,
    step2,
    transferMore,
    progress,
    isBlockingNavigatingAway,
  }
}
