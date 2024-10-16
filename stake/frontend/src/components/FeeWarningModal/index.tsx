import { FC } from 'react'
import { Modal, ModalProps } from '../Modal'
import classes from './index.module.css'
import { Button } from '../Button'
import { CONSENSUS_DECIMALS, FEE_DEDUCTION_MULTIPLIER } from '../../constants/config'
import { Amount } from '../Amount'
import { AmountInput } from '../AmountInput'
import { NumberUtils } from '../../utils/number.utils'

interface FeeWarningModalProps extends Pick<ModalProps, 'isOpen' | 'closeModal'> {
  fee: bigint
  amount: bigint
  next: (amount: string) => void
}

export const FeeWarningModal: FC<FeeWarningModalProps> = ({ isOpen, closeModal, next, fee, amount }) => {
  const estimatedFeeDeduction = fee * BigInt(FEE_DEDUCTION_MULTIPLIER)
  const estimatedAmountWithoutFee = amount - fee
  const estimatedAmountWithDeductedFees = amount - estimatedFeeDeduction
  const consensusAmountWithDeductedFees = NumberUtils.sapphireAmountToConsensusAmount(
    estimatedAmountWithDeductedFees
  )

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} disableBackdropClick>
      <div className={classes.feeWarningModalContent}>
        <h4>You have chosen to stake your entire balance</h4>

        <p>
          It is recommended to keep a small amount in your wallet at all times to cover future transactions.
        </p>
        <p>
          Choose if you want to stake the reduced amount and keep &#123;sum of {FEE_DEDUCTION_MULTIPLIER} x
          gas fee - e.g. ‘
          <b>
            <Amount className={classes.feeWarningModalAmount} amount={estimatedFeeDeduction} />
          </b>
          ’&#125; in your account, or continue with the full amount.
        </p>

        <AmountInput
          className={classes.feeWarningModalInput}
          label="Stake amount"
          initialValue={consensusAmountWithDeductedFees.div(10 ** CONSENSUS_DECIMALS).toString()}
        />

        <div className={classes.feeWarningModalActions}>
          <Button
            className={classes.feeWarningModalButton}
            onClick={() => next(consensusAmountWithDeductedFees.toString())}
          >
            <span className={classes.feeWarningModalButtonText}>Stake reduced amount</span>
          </Button>

          <button
            className={classes.feeWarningModalFullAmount}
            onClick={() =>
              next(NumberUtils.sapphireAmountToConsensusAmount(estimatedAmountWithoutFee).toString())
            }
          >
            Continue with full amount
          </button>
        </div>
      </div>
    </Modal>
  )
}
