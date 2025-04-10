import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { usePrevious } from './hooks/usePrevious.ts'
import {
  fromBaseUnitsToTrackEventCents,
  getConsensusBalance,
  waitForConsensusBalance,
  waitForSapphireBalance,
} from './utils/getBalances'
import { useBlockNavigatingAway } from './utils/useBlockNavigatingAway'
import { transferToConsensus } from './withdraw/transferToConsensus'
import { ConsensusAccount, SapphireAccount } from './withdraw/useGenerateSapphireAccount'
import { minimalWithdrawableAmount, withdrawToConsensus } from './withdraw/withdrawToConsensus'
import { trackEvent } from 'fathom-client'
import { consensusConfig, sapphireConfig } from './utils/oasisConfig.ts'
import { UnmountedAbortError, useUnmountSignal } from './utils/useUnmountSignal'

/**
 * sapphireAddress -> generatedSapphireAccount -> generatedConsensusAccount -> consensusAddress
 */
export function useWithdraw({
  generatedSapphireAccount,
  generatedConsensusAccount,
}: {
  generatedSapphireAccount: SapphireAccount
  generatedConsensusAccount: ConsensusAccount
}) {
  const unmountSignal = useUnmountSignal()
  const { isBlockingNavigatingAway, blockNavigatingAway, allowNavigatingAway } = useBlockNavigatingAway()
  const sapphireAddress = useAccount().address

  const [consensusAddress, setConsensusAddress] = useState<`oasis1${string}`>()
  const [progress, setProgress] = useState({ percentage: 0 as number | undefined, message: '' })
  const [isInputMode, setIsInputMode] = useState(true)
  const { refetch: updateBalanceInsideConnectButton, data: availableBalance } = useBalance({
    address: sapphireAddress,
  })
  const { sendTransactionAsync } = useSendTransaction()
  const isPrevError = usePrevious(progress.percentage === undefined)

  async function step3(value: bigint) {
    if (!generatedSapphireAccount) return

    await sendTransactionAsync({
      to: generatedSapphireAccount?.address,
      value,
    })

    trackEvent('withdrawal flow form submitted', {
      _value: fromBaseUnitsToTrackEventCents(value, sapphireConfig.decimals),
    })
  }

  async function step4(consensusAddress: `oasis1${string}`, retryingAfterError: number) {
    // Note: outside state var consensusAddress is outdated. Use param.
    if (!sapphireAddress) return
    if (!generatedSapphireAccount) return
    if (!generatedConsensusAccount) return
    if (!consensusAddress) return

    try {
      const foundStuckRoseTokens = await getConsensusBalance(generatedConsensusAccount.address)
      if (foundStuckRoseTokens.raw <= 0n) {
        setProgress({ percentage: 0.05, message: 'Waiting to move your ROSE…' })
        const availableAmountToWithdraw = await waitForSapphireBalance(
          generatedSapphireAccount.address,
          minimalWithdrawableAmount,
          unmountSignal
        )
        setProgress({ percentage: 0.25, message: 'ROSE transfer initiated' })

        blockNavigatingAway()
        await updateBalanceInsideConnectButton()
        await withdrawToConsensus({
          availableAmountToWithdraw: availableAmountToWithdraw.raw,
          sapphireAccount: generatedSapphireAccount,
          consensusAddress: generatedConsensusAccount.address,
        })
        setProgress({ percentage: 0.5, message: 'ROSE transfer initiated' })
      } else {
        setProgress({ percentage: 0.25, message: 'ROSE transfer initiated' })
      }

      // TODO: handle probable failure if balance doesn't change after ~10 seconds of withdraw
      const amountToWithdraw2 = await waitForConsensusBalance(
        generatedConsensusAccount.address,
        0n,
        unmountSignal
      )

      trackEvent('withdrawal flow started', {
        _value: fromBaseUnitsToTrackEventCents(amountToWithdraw2.raw, consensusConfig.decimals),
      })

      const preWithdrawConsensusBalance = await getConsensusBalance(consensusAddress)
      if (unmountSignal.aborted) throw new UnmountedAbortError()
      await transferToConsensus({
        amount: amountToWithdraw2.raw,
        fromConsensusAccount: generatedConsensusAccount,
        toConsensusAddress: consensusAddress,
      })
      setProgress({ percentage: 0.75, message: `Withdrawing ${amountToWithdraw2.formatted} ROSE` })
      if (window.mock && !retryingAfterError) throw 'mock error'
      await waitForConsensusBalance(consensusAddress, preWithdrawConsensusBalance.raw, unmountSignal)
      setProgress({
        percentage: 1.0,
        message: 'Your ROSE transfer is complete!',
      })

      trackEvent('withdrawal flow finished', {
        _value: fromBaseUnitsToTrackEventCents(amountToWithdraw2.raw, consensusConfig.decimals),
      })

      allowNavigatingAway() // Stop blocking unless new transfer comes in
    } catch (err) {
      if (err instanceof UnmountedAbortError) return // Ignore and stop looping
      console.error(err)
      setProgress({ percentage: undefined, message: `Error. Retrying…` })
      await new Promise(r => setTimeout(r, 6000))
      allowNavigatingAway()
      await step4(consensusAddress, retryingAfterError + 1) // Loop to retry
      return
    }

    try {
      await new Promise(r => setTimeout(r, 6000))
      if (unmountSignal.aborted) throw new UnmountedAbortError()
      // Stay on "Withdrawn" screen unless new transfer comes in
      await waitForSapphireBalance(generatedSapphireAccount.address, minimalWithdrawableAmount, unmountSignal)
      if (unmountSignal.aborted) throw new UnmountedAbortError()
      // Don't loop, force user to input destination again
      transferMore()
    } catch (err) {
      return // Ignore
    }
  }

  function transferMore() {
    setIsInputMode(true)
  }

  return {
    sapphireAddress,
    consensusAddress,
    setConsensusAddress,
    step3,
    step4,
    transferMore,
    availableBalance,
    progress,
    isBlockingNavigatingAway,
    isInputMode,
    setIsInputMode,
    isPrevError,
  }
}
