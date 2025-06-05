import { FC } from 'react'
import { WrapModal, WrapModalProps, LogoIconRound, WrapInput } from '@oasisprotocol/rose-app-ui/wrap'
import { Button } from '@oasisprotocol/ui-library/src'
import classes from './index.module.css'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WRAP_FEE_DEDUCTION_MULTIPLIER } from '../../constants/config'
import { NumberUtils } from '../../utils/number.utils'
import BigNumber from 'bignumber.js'
import { formatEther } from 'viem'

interface WrapFeeWarningModalProps extends Pick<WrapModalProps, 'isOpen' | 'closeModal'> {
  next: (amount: BigNumber) => void
}

export const WrapFeeWarningModal: FC<WrapFeeWarningModalProps> = ({ isOpen, closeModal, next }) => {
  const {
    state: { amount, estimatedFee },
  } = useWrapForm()
  const estimatedFeeDeduction = estimatedFee.multipliedBy(WRAP_FEE_DEDUCTION_MULTIPLIER)

  const roseAmount = NumberUtils.ensureNonNullBigNumber(amount)
  const estimatedAmountWithDeductedFees = roseAmount!.minus(estimatedFeeDeduction)

  return (
    <WrapModal isOpen={isOpen} closeModal={closeModal} disableBackdropClick>
      <div className={classes.wrapFeeWarningModalContent}>
        <div className={classes.wrapFeeWarningModalLogo}>
          <LogoIconRound />
        </div>

        <h4>You have chosen to wrap your entire balance</h4>

        <p>
          It is recommended to keep a small amount in your wallet at all times to cover future transactions.
        </p>
        <p>
          Choose if you want to wrap the reduced amount and keep &#123;sum of {WRAP_FEE_DEDUCTION_MULTIPLIER}{' '}
          x gas fee - e.g. ‘<b>{formatEther(NumberUtils.BNtoBigInt(estimatedFeeDeduction))} ROSE</b>’&#125; in
          your account, or continue with the full amount.
        </p>

        <WrapInput<string>
          className={classes.wrapFeeWarningModalInput}
          variant="dark"
          disabled
          type="text"
          label="wROSE"
          placeholder="0"
          inputMode="decimal"
          value={formatEther(NumberUtils.BNtoBigInt(estimatedAmountWithDeductedFees))}
        />

        <div className={classes.wrapFeeWarningModalActions}>
          <Button
            className={classes.wrapFeeWarningModalButton}
            onClick={() => next(estimatedAmountWithDeductedFees)}
          >
            <span className={classes.wrapFeeWarningModalButtonText}>Wrap reduced amount</span>
          </Button>

          <button className={classes.wrapFeeWarningModalFullAmount} onClick={() => next(amount!)}>
            Continue with full amount
          </button>
        </div>
      </div>
    </WrapModal>
  )
}
