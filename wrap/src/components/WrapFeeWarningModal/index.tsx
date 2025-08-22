import { FC } from 'react'
import { WrapInput } from '@oasisprotocol/rose-app-ui/wrap'
import { Logo } from '@oasisprotocol/rose-app-ui'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@oasisprotocol/ui-library/src'
import classes from './index.module.css'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WRAP_FEE_DEDUCTION_MULTIPLIER } from '../../constants/config'
import { NumberUtils } from '../../utils/number.utils'
import BigNumber from 'bignumber.js'
import { formatEther } from 'viem'

interface WrapFeeWarningModalProps {
  isOpen: boolean
  closeModal: () => void
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
    <Dialog open={isOpen} onOpenChange={closeModal} modal>
      <DialogContent className={'gap-[3.125rem]'}>
        <DialogHeader className={'gap-[1rem]'}>
          <div className="self-center mb-[2rem]">
            <Logo imageOnly />
          </div>

          <DialogTitle>You have chosen to wrap your entire balance</DialogTitle>

          <DialogDescription>
            <p className={'mb-[1rem]'}>
              It is recommended to keep a small amount in your wallet at all times to cover future
              transactions.
            </p>
            <p>
              Choose if you want to wrap the reduced amount and keep &#123;sum of{' '}
              {WRAP_FEE_DEDUCTION_MULTIPLIER} x gas fee - e.g. ‘
              <b>{formatEther(NumberUtils.BNtoBigInt(estimatedFeeDeduction))} ROSE</b>’&#125; in your account,
              or continue with the full amount.
            </p>
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <DialogClose asChild>
            <Button size="lg" onClick={() => next(estimatedAmountWithDeductedFees)}>
              Wrap reduced amount
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button variant="destructive" size="lg" onClick={() => next(amount!)}>
              Continue with full amount
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
