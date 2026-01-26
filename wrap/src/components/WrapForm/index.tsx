import { FC, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWrapForm } from '../../hooks/useWrapForm'
import { WrapFormType } from '../../utils/types'
import { useInterval } from '../../hooks/useInterval'
import { NumberUtils } from '../../utils/number.utils'
import { WrapFeeWarningModal } from '../WrapFeeWarningModal'
import { BaseError, formatEther, parseEther } from 'viem'
import BigNumber from 'bignumber.js'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@oasisprotocol/ui-library/src/components/ui/input-group' // TODO: fix import path in UIL
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { ArrowUpDown } from 'lucide-react'
import { Separator } from '@oasisprotocol/ui-library/src/components/separator'
import { Label } from '@oasisprotocol/ui-library/src/components/label'

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
    state: { formType, amount, isLoading, balance, estimatedFee, wRoseBalance },
    toggleFormType,
    setAmount,
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

  const handleValueChange = (amount: string) => {
    setValue(amount)
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
      // E.g. ex.shortMessage: 'User rejected the request.'
      // ex.message: 'User rejected the request.\n\nRequest Arguments:\n  from: ...'
      // ex.cause.cause.code: 4001
      setError((ex as BaseError)?.shortMessage || (ex as Error)?.message || JSON.stringify(ex))
    }
  }

  const handleFormSubmit = async (e: FormEvent) => {
    setError('')
    e.preventDefault()

    try {
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
        submitTransaction(amount)
      }
    } catch (ex) {
      setError((ex as BaseError)?.shortMessage || (ex as Error)?.message || JSON.stringify(ex))
    }
  }

  const submitWrapFeeModal = (amount: BigNumber) => {
    submitTransaction(amount)
    setIsWrapFeeModalOpen(false)
  }

  const estimatedFeeTruncated =
    estimatedFee && estimatedFee.gt(0) ? `~${NumberUtils.getTruncatedAmount(estimatedFee)} ROSE` : '/'

  const handlePercentageCalc = () => {
    const percentage = BigNumber(100)
    if (formType === WrapFormType.WRAP) {
      /* In case of 100% WRAP, deduct gas fee */
      const percAmount = NumberUtils.getPercentageAmount(balance, percentage)
      setAmount(percAmount.minus(estimatedFee))
    } else if (formType === WrapFormType.UNWRAP) {
      setAmount(NumberUtils.getPercentageAmount(wRoseBalance, percentage))
    } else {
      throw new Error('[formType] Invalid form type')
    }
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstInputLabel">From</Label>
            <InputGroup>
              <InputGroupInput
                id="firstInputLabel"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                pattern={AMOUNT_PATTERN}
                disabled={isLoading}
                placeholder="0"
                value={value}
                onChange={handleValueChange}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={handlePercentageCalc} variant="link" size="sm">
                  Max
                </InputGroupButton>
                <span className="text-muted-foreground font-medium">{firstInputLabel}</span>
              </InputGroupAddon>
            </InputGroup>
            <span className="text-xs text-muted-foreground">
              Balance: {formType === WrapFormType.WRAP && NumberUtils.getTruncatedAmount(balance)}
              {formType === WrapFormType.UNWRAP && NumberUtils.getTruncatedAmount(wRoseBalance)}{' '}
              {firstInputLabel}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <Separator className="max-w-[40%]" />
            <Button
              className="text-primary bg-[#162A2D]"
              variant="secondary"
              size="icon"
              onClick={handleToggleFormType}
              disabled={isLoading}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Separator className="max-w-[40%]" />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="firstInputLabel">To</Label>
            <InputGroup>
              <InputGroupInput
                id="secondInputLabel"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                autoCorrect="off"
                pattern={AMOUNT_PATTERN}
                disabled={isLoading}
                placeholder="0"
                value={value}
                onChange={handleValueChange}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton onClick={handlePercentageCalc} variant="link" size="sm">
                  Max
                </InputGroupButton>
                <span className="text-muted-foreground font-medium">{secondInputLabel}</span>
              </InputGroupAddon>
            </InputGroup>
            <span className="text-xs text-muted-foreground">
              Balance: {formType === WrapFormType.WRAP && NumberUtils.getTruncatedAmount(wRoseBalance)}
              {formType === WrapFormType.UNWRAP && NumberUtils.getTruncatedAmount(balance)} {secondInputLabel}
            </span>
          </div>
        </div>

        <div className="my-6 flex items-center justify-between">
          <span className="text-sm text-foreground">Estimated gas fee:</span>
          <span className="text-sm font-medium text-foreground"> {estimatedFeeTruncated}</span>
        </div>

        <Button size="lg" disabled={isLoading} type="submit" className="w-full">
          {submitBtnLabel}
        </Button>

        {error && <p className="pt-2 text-error text-xs">{error}</p>}
      </form>
      <WrapFeeWarningModal
        isOpen={isWrapFeeModalOpen}
        closeModal={() => setIsWrapFeeModalOpen(false)}
        next={submitWrapFeeModal}
      />
    </div>
  )
}
