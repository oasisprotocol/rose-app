import { ChangeEvent, FC, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { Button, Alert } from '@oasisprotocol/ui-library/src'
import { Input, Label } from '@oasisprotocol/ui-library/src'
import classes from './index.module.css'
import { useNavigate } from 'react-router-dom'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WrapFormType } from '../../utils/types'
import { useInterval } from '../../hooks/useInterval'
import { NumberUtils } from '../../utils/number.utils'
import { WrapFeeWarningModal } from '../WrapFeeWarningModal'
import { formatEther, parseEther } from 'viem'
import BigNumber from 'bignumber.js'
import { ToggleButton } from '../ToggleButton'

const AMOUNT_PATTERN = '^[0-9]*[.,]?[0-9]*$'

interface WrapFormLabels {
  firstInputLabel: string
  secondInputLabel: string
  submitBtnLabel: string
}

const labelMapByFormType: Record<WrapFormType, WrapFormLabels> = {
  [WrapFormType.WRAP]: {
    firstInputLabel: 'ROSE',
    secondInputLabel: 'wROSE',
    submitBtnLabel: 'Wrap tokens',
  },
  [WrapFormType.UNWRAP]: {
    firstInputLabel: 'wROSE',
    secondInputLabel: 'ROSE',
    submitBtnLabel: 'Unwrap tokens',
  },
}

export const WrapForm: FC = () => {
  const navigate = useNavigate()
  const {
    state: { formType, amount, isLoading, balance, estimatedFee },
    toggleFormType,
    submit,
    debounceLeadingSetFeeAmount,
  } = useWrapForm()
  const { firstInputLabel, secondInputLabel, submitBtnLabel } = labelMapByFormType[formType]
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [isWrapFeeModalOpen, setIsWrapFeeModalOpen] = useState(false)
  const debouncedSetFeeAmount = useRef(debounceLeadingSetFeeAmount())

  useEffect(() => {
    // Trigger fee calculation on value change
    debouncedSetFeeAmount.current()
  }, [value])

  useInterval(() => {
    // Trigger fee calculation every minute, in case fee data becomes stale
    debouncedSetFeeAmount.current()
  }, 60000)

  useEffect(() => {
    setError('')
    const formattedAmount = amount ? formatEther(NumberUtils.BNtoBigInt(amount)) : ''

    setValue(formattedAmount)
  }, [setValue, amount])

  const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleToggleFormType = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toggleFormType(value ? NumberUtils.BigIntToBN(parseEther(value)) : null)
  }

  const submitTransaction = async (amount: BigNumber) => {
    try {
      const txHash = await submit(amount)

      navigate(`/wrap/tx/${txHash}?amount=${value}&action=${formType}`)
    } catch (ex) {
      setError((ex as Error)?.message || JSON.stringify(ex))
    }
  }

  const handleFormSubmit = async (e: FormEvent) => {
    setError('')
    e.preventDefault()

    const amount = NumberUtils.BigIntToBN(parseEther(value || '0'))

    if (
      formType === WrapFormType.WRAP &&
      NumberUtils.shouldShowWrapFeeWarningModal({
        fee: estimatedFee,
        amount,
        accountBalanceAmount: balance,
      })
    ) {
      setIsWrapFeeModalOpen(true)
    } else {
      void submitTransaction(amount)
    }
  }

  const submitWrapFeeModal = (amount: BigNumber) => {
    void submitTransaction(amount)
    setIsWrapFeeModalOpen(false)
  }

  const estimatedFeeTruncated =
    estimatedFee && estimatedFee.gt(0) ? `~${NumberUtils.getTruncatedAmount(estimatedFee)} ROSE` : '/'

  return (
    <div>
      <form className={classes.wrapForm} onSubmit={handleFormSubmit}>
        <div className={classes.wrapFormInputs}>
          <Label htmlFor="field-1">{firstInputLabel}</Label>
          <Input
            id="field-1"
            disabled={isLoading}
            type="text"
            pattern={AMOUNT_PATTERN}
            placeholder="0"
            inputMode="decimal"
            value={value}
            onChange={handleValueChange}
          />
          <Label htmlFor="field-2">{secondInputLabel}</Label>
          <Input
            id="field-2"
            disabled={isLoading}
            type="text"
            pattern={AMOUNT_PATTERN}
            placeholder="0"
            inputMode="decimal"
            value={value}
            onChange={handleValueChange}
          />
          <ToggleButton className={classes.toggleBtn} onClick={handleToggleFormType} disabled={isLoading} />
        </div>

        <h4 className={classes.gasEstimateLabel}>Estimated fee: {estimatedFeeTruncated}</h4>

        <Button variant="default" disabled={isLoading} type="submit" className="w-full">
          {submitBtnLabel}
        </Button>
        {error && <Alert variant="destructive">{error}</Alert>}
      </form>
      <WrapFeeWarningModal
        isOpen={isWrapFeeModalOpen}
        closeModal={() => setIsWrapFeeModalOpen(false)}
        next={submitWrapFeeModal}
      />
    </div>
  )
}
