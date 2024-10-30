import { useState } from 'react'
import { parseEther } from 'viem'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { getConsensusBalance, waitForConsensusBalance, waitForSapphireBalance } from './utils/getBalances'
import { useBlockNavigatingAway } from './utils/useBlockNavigatingAway'
import { transferToConsensus } from './withdraw/transferToConsensus'
import { useGenerateSapphireAccount } from './withdraw/useGenerateSapphireAccount'
import { minimalWithdrawableAmount, withdrawToConsensus } from './withdraw/withdrawToConsensus'

/**
 * sapphireAddress -> generatedSapphireAccount -> generatedConsensusAccount -> consensusAddress
 */
export function useWithdraw() {
  const { isBlockingNavigatingAway, blockNavigatingAway, allowNavigatingAway } = useBlockNavigatingAway()
  const sapphireAddress = useAccount().address
  const { generatedSapphireAccount, generatedConsensusAccount, generateSapphireAccount } = useGenerateSapphireAccount()
  const [consensusAddress, setConsensusAddress] = useState<`oasis1${string}`>()
  const [progress, setProgress] = useState({ percentage: 0 as number | undefined, message: '' })
  const { refetch: updateBalanceInsideConnectButton, data: availableBalance } = useBalance({ address: sapphireAddress })
  const { sendTransactionAsync } = useSendTransaction()

  async function step2() {
    if (!sapphireAddress) return
    await generateSapphireAccount(sapphireAddress)
  }
  // Long running promise, doesn't get canceled if this component is destroyed
  async function step3(consensusAddress: `oasis1${string}`) {
    // Note: outside state var consensusAddress is outdated. Use param.
    if (!sapphireAddress) return
    if (!generatedSapphireAccount) return
    if (!generatedConsensusAccount) return
    if (!consensusAddress) return
    try {
      const foundStuckRoseTokens = await getConsensusBalance(generatedConsensusAccount.address)
      if (foundStuckRoseTokens.raw <= 0n) {
        setProgress({ percentage: 0.05, message: 'Awaiting ROSE transfer…' })
        const availableAmountToWithdraw = await waitForSapphireBalance(
          generatedSapphireAccount.address,
          minimalWithdrawableAmount,
        )
        setProgress({ percentage: 0.25, message: `${availableAmountToWithdraw.formatted} ROSE detected` })
        blockNavigatingAway()
        await updateBalanceInsideConnectButton()
        await withdrawToConsensus({
          availableAmountToWithdraw: availableAmountToWithdraw.raw,
          sapphireAccount: generatedSapphireAccount,
          consensusAddress: generatedConsensusAccount.address,
        })
        setProgress({ percentage: 0.5, message: `Withdrawing ${availableAmountToWithdraw.formatted} ROSE` })
      } else {
        setProgress({ percentage: 0.25, message: `${foundStuckRoseTokens.formatted} ROSE detected` })
      }
      // TODO: handle probable failure if balance doesn't change after ~10 seconds of withdraw
      const amountToWithdraw2 = await waitForConsensusBalance(generatedConsensusAccount.address, 0n)
      const preWithdrawConsensusBalance = await getConsensusBalance(consensusAddress)
      await transferToConsensus({
        amount: amountToWithdraw2.raw,
        fromConsensusAccount: generatedConsensusAccount,
        toConsensusAddress: consensusAddress,
      })
      setProgress({ percentage: 0.75, message: `Withdrawing ${amountToWithdraw2.formatted} ROSE` })
      await waitForConsensusBalance(consensusAddress, preWithdrawConsensusBalance.raw)
      setProgress({
        percentage: 1.0,
        message: `${amountToWithdraw2.formatted} ROSE withdrawn to Consensus`,
      })
      allowNavigatingAway() // Stop blocking unless new transfer comes in

      await new Promise((r) => setTimeout(r, 6000))
      // Stay on "Withdrawn" screen unless new transfer comes in
      await waitForSapphireBalance(generatedSapphireAccount.address, 0n)
      if (window.mock) throw 'mock error'
    } catch (err) {
      console.error(err)
      setProgress({ percentage: undefined, message: `Error. Retrying…` })
      await new Promise((r) => setTimeout(r, 6000))
    } finally {
      allowNavigatingAway()
    }

    // Loop
    await step3(consensusAddress)
  }

  function transferMore() {
    // Just pretends to be on that step. In reality process is still stuck at
    // waitForConsensusBalance, but if user makes a transfer, it becomes real.
    setProgress({ percentage: 0.05, message: 'Awaiting ROSE transfer…' })
  }

  /** Transfer into step3 */
  async function step4(amount: string) {
    if (!generatedSapphireAccount) return
    await sendTransactionAsync({
      to: generatedSapphireAccount?.address,
      value: parseEther(amount),
    })
  }

  return {
    sapphireAddress,
    generatedSapphireAccount,
    generatedConsensusAccount,
    consensusAddress,
    setConsensusAddress,
    step2,
    step3,
    step4,
    transferMore,
    availableBalance,
    progress,
    isBlockingNavigatingAway,
  }
}
