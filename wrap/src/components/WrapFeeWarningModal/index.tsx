import { FC } from 'react'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WRAP_FEE_DEDUCTION_MULTIPLIER } from '../../constants/config'
import { NumberUtils } from '../../utils/number.utils'
import BigNumber from 'bignumber.js'
import { formatEther } from 'viem'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@oasisprotocol/ui-library/src/components/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@oasisprotocol/ui-library/src/components/ui/input-group' // TODO: fix import path in UIL

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
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[45vw]">
        <DialogHeader className="gap-3">
          <DialogTitle>You have chosen to wrap your entire balance</DialogTitle>
          <DialogDescription className="flex flex-col gap-3">
            <span className="text-muted-foreground">
              It is recommended to keep a small amount in your wallet at all times to cover future
              transactions.
            </span>
            <span className="text-muted-foreground">
              Choose if you want to wrap the reduced amount and keep &#123;sum of{' '}
              {WRAP_FEE_DEDUCTION_MULTIPLIER} x gas fee - e.g. ‘
              <b>{formatEther(NumberUtils.BNtoBigInt(estimatedFeeDeduction))} ROSE</b>’&#125; in your account,
              or continue with the full amount.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="inline-flex items-center justify-center my-4">
          <div className="flex items-center justify-center">
            <InputGroup>
              <InputGroupInput
                id="value-field"
                disabled
                type="text"
                placeholder="0"
                inputMode="decimal"
                value={formatEther(NumberUtils.BNtoBigInt(estimatedAmountWithDeductedFees))}
              />
              <InputGroupAddon align="inline-end">
                <span className="text-muted-foreground font-medium">wROSE</span>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>

        <DialogFooter className="flex justify-between gap-3">
          <DialogClose asChild>
            <Button variant="ghost" size="lg" onClick={() => next(amount!)}>
              Continue with full amount
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button size="lg" onClick={() => next(estimatedAmountWithDeductedFees)}>
              Wrap reduced amount
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
