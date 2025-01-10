import { useState } from 'react'
import { useAccount, useBalance, useSendTransaction } from 'wagmi'
import { usePrevious } from './hooks/usePrevious.ts'
import {
  getConsensusBalance,
  waitForConsensusBalanceCancelable,
  waitForSapphireBalanceCancelable,
} from './utils/getBalances'
import { useBlockNavigatingAway } from './utils/useBlockNavigatingAway'
import { transferToConsensus } from './withdraw/transferToConsensus'
import { useGenerateSapphireAccount } from './withdraw/useGenerateSapphireAccount'
import { minimalWithdrawableAmount, withdrawToConsensus } from './withdraw/withdrawToConsensus'
import {
  CancelablePromise,
  CANCELABLE_PROMISE_ABORT_SIGNAL_ERROR_MESSAGE,
  cancelableTimeout,
  makeCancelablePromise,
} from './utils/cancelablePromise.ts'

// Use global variable here, due to step4 using different context(not in sync with react hooks)
let isInputModeGlobal = true
const setIsInputModeGlobal = (_isInputMode: boolean) => {
  isInputModeGlobal = _isInputMode
}

/**
 * sapphireAddress -> generatedSapphireAccount -> generatedConsensusAccount -> consensusAddress
 */
export function useWithdraw() {
  const { isBlockingNavigatingAway, blockNavigatingAway, allowNavigatingAway } = useBlockNavigatingAway()
  const sapphireAddress = useAccount().address
  const { generatedSapphireAccount, generatedConsensusAccount, generateSapphireAccount } =
    useGenerateSapphireAccount()
  const [consensusAddress, setConsensusAddress] = useState<`oasis1${string}`>()
  const [progress, setProgress] = useState({ percentage: 0 as number | undefined, message: '' })
  const [_isInputMode, _setIsInputMode] = useState(true)
  const { refetch: updateBalanceInsideConnectButton, data: availableBalance } = useBalance({
    address: sapphireAddress,
  })
  const { sendTransactionAsync } = useSendTransaction()
  const isPrevError = usePrevious(progress.percentage === undefined)

  async function step2() {
    if (!sapphireAddress) return
    await generateSapphireAccount(sapphireAddress)
  }

  async function step3(value: bigint) {
    if (!generatedSapphireAccount) return
    await sendTransactionAsync({
      to: generatedSapphireAccount?.address,
      value,
    })
  }

  async function step4Cancelable(consensusAddress: `oasis1${string}`, signal: AbortSignal) {
    // Note: outside state var consensusAddress is outdated. Use param.
    if (!sapphireAddress) return
    if (!generatedSapphireAccount) return
    if (!generatedConsensusAccount) return
    if (!consensusAddress) return

    try {
      const foundStuckRoseTokens = await getConsensusBalance(generatedConsensusAccount.address)
      if (foundStuckRoseTokens.raw <= 0n) {
        setProgress({ percentage: 0.05, message: 'Waiting to move your ROSE…' })
        const availableAmountToWithdraw = await waitForSapphireBalanceCancelable(
          generatedSapphireAccount.address,
          minimalWithdrawableAmount,
          signal
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
      const amountToWithdraw2 = await waitForConsensusBalanceCancelable(
        generatedConsensusAccount.address,
        0n,
        signal
      )
      const preWithdrawConsensusBalance = await getConsensusBalance(consensusAddress)
      await transferToConsensus({
        amount: amountToWithdraw2.raw,
        fromConsensusAccount: generatedConsensusAccount,
        toConsensusAddress: consensusAddress,
      })
      setProgress({ percentage: 0.75, message: `Withdrawing ${amountToWithdraw2.formatted} ROSE` })
      await waitForConsensusBalanceCancelable(consensusAddress, preWithdrawConsensusBalance.raw, signal)
      setProgress({
        percentage: 1.0,
        message: 'Your ROSE transfer is complete!',
      })
      allowNavigatingAway() // Stop blocking unless new transfer comes in

      await cancelableTimeout(6000, signal)
      // Stay on "Withdrawn" screen unless new transfer comes in
      await waitForSapphireBalanceCancelable(generatedSapphireAccount.address, 0n, signal)
      if (window.mock) throw 'mock error'
    } catch (err) {
      if (err instanceof Error && err.message === CANCELABLE_PROMISE_ABORT_SIGNAL_ERROR_MESSAGE) {
        console.log('Withdraw flow canceled!')
        return
      }

      console.error(err)
      setProgress({ percentage: undefined, message: `Error. Retrying…` })
      await cancelableTimeout(6000, signal)
    } finally {
      allowNavigatingAway()
    }

    // Loop unless in input mode, case when user click transfer more
    if (!isInputModeGlobal) {
      await step4Cancelable(consensusAddress, signal)
    }
  }

  function step4(consensusAddress: `oasis1${string}`): CancelablePromise<void> {
    return makeCancelablePromise<void>(async (resolve, reject, signal) => {
      try {
        await step4Cancelable(consensusAddress, signal)
        resolve()
      } catch (err) {
        reject(err as Error)
      }
    })
  }

  function setIsInputMode(inputMode: boolean) {
    _setIsInputMode(inputMode)
    setIsInputModeGlobal(inputMode)
  }

  function transferMore() {
    setIsInputMode(true)
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
    isInputMode: _isInputMode,
    setIsInputMode,
    isPrevError,
  }
}
