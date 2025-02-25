import { useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'
import { depositToSapphireStep1, depositToSapphireStep2 } from './deposit/depositToSapphire'
import { ConsensusAccount } from './deposit/useGenerateConsensusAccount'
import { usePrevious } from './hooks/usePrevious.ts'
import {
  fromBaseUnitsToTrackEventCents,
  getSapphireBalance,
  waitForConsensusBalance,
  waitForSapphireBalance,
} from './utils/getBalances'
import { useBlockNavigatingAway } from './utils/useBlockNavigatingAway'
import { trackEvent } from 'fathom-client'
import { consensusConfig } from './utils/oasisConfig.ts'
import { UnmountedAbortError, useUnmountSignal } from './utils/useUnmountSignal'

/** any consensus -> generatedConsensusAccount -> sapphireAddress */
export function useDeposit({ generatedConsensusAccount }: { generatedConsensusAccount: ConsensusAccount }) {
  const unmountSignal = useUnmountSignal()
  const { isBlockingNavigatingAway, blockNavigatingAway, allowNavigatingAway } = useBlockNavigatingAway()
  const sapphireAddress = useAccount().address
  const [progress, setProgress] = useState({ percentage: 0 as number | undefined, message: '' })
  const { refetch: updateBalanceInsideConnectButton } = useBalance({ address: sapphireAddress })
  const isPrevError = usePrevious(progress.percentage === undefined)

  // Automatically start listening, and only cancel if unmounted.
  useEffect(() => {
    if (!sapphireAddress) throw new Error('useDeposit used before wallet connected')
    blockNavigatingAway() // Start blocking early for the first transfer
    step3(generatedConsensusAccount, sapphireAddress)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function step3(consensusAccount: ConsensusAccount, sapphireAddress: `0x${string}`) {
    // Note: don't use outside state vars. They are outdated.
    try {
      await new Promise(r => setTimeout(r, 1000)) // Handle React StrictMode: step3 is called by useEffect on mount
      if (unmountSignal.aborted) throw new UnmountedAbortError()

      setProgress({ percentage: 0.05, message: 'Waiting to move your ROSE…' })
      const amountToDeposit = await waitForConsensusBalance(consensusAccount.address, 0n, unmountSignal)

      trackEvent('deposit flow started', {
        _value: fromBaseUnitsToTrackEventCents(amountToDeposit.raw, consensusConfig.decimals),
      })

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
      await waitForSapphireBalance(sapphireAddress, preDepositSapphireBalance.raw, unmountSignal)
      // TODO: handle probable failure if balance doesn't change after ~10 seconds of depositing
      setProgress({
        percentage: 1.0,
        message: 'Your ROSE transfer is complete!',
      })

      trackEvent('deposit flow finished', {
        _value: fromBaseUnitsToTrackEventCents(amountToDeposit.raw, consensusConfig.decimals),
      })

      allowNavigatingAway() // Stop blocking unless new transfer comes in
      await updateBalanceInsideConnectButton()

      if (unmountSignal.aborted) throw new UnmountedAbortError()
      await new Promise(r => setTimeout(r, 6000))
      // Stay on "Deposited" screen unless new transfer comes in
      await waitForConsensusBalance(consensusAccount.address, 0n, unmountSignal)
      if (unmountSignal.aborted) throw new UnmountedAbortError()
      if (window.mock) throw 'mock error'
    } catch (err) {
      if (err instanceof UnmountedAbortError) return // Ignore and stop looping
      console.error(err)
      setProgress({ percentage: undefined, message: `Error. Retrying…` })
      await new Promise(r => setTimeout(r, 6000))
    } finally {
      allowNavigatingAway()
    }

    // Loop
    await step3(consensusAccount, sapphireAddress)
  }

  function transferMore() {
    // Just pretends to be on that step. In reality process is still stuck at
    // waitForConsensusBalance, but if user makes a transfer, it becomes real.
    setProgress({ percentage: 0.05, message: 'Waiting to move your ROSE…' })
  }

  return {
    sapphireAddress,
    transferMore,
    progress,
    isBlockingNavigatingAway,
    isPrevError,
  }
}
