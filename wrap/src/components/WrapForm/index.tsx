import { ChangeEvent, FC, FormEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { Button, Alert, AlertTitle, cn, Separator, Input, Label } from '@oasisprotocol/ui-library/src'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
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

interface WrapFormData {
  firstInputLabel: string
  secondInputLabel: string
  submitBtnLabel: string
  firstBalance: string
  secondBalance: string
}

export const WrapForm: FC = () => {
  const navigate = useNavigate()
  const {
    state: { formType, amount, isLoading, balance, wRoseBalance, estimatedFee },
    toggleFormType,
    submit,
    debounceLeadingSetFeeAmount,
  } = useWrapForm()

  const roseBalanceString = `${balance ? formatEther(NumberUtils.BNtoBigInt(balance)) : '0'} ROSE`
  const wRoseBalanceString = `${wRoseBalance ? formatEther(NumberUtils.BNtoBigInt(wRoseBalance)) : '0'} wROSE`

  const labelMapByFormType: Record<WrapFormType, WrapFormData> = {
    [WrapFormType.WRAP]: {
      firstInputLabel: 'ROSE',
      secondInputLabel: 'wROSE',
      submitBtnLabel: 'Wrap tokens',
      firstBalance: roseBalanceString,
      secondBalance: wRoseBalanceString,
    },
    [WrapFormType.UNWRAP]: {
      firstInputLabel: 'wROSE',
      secondInputLabel: 'ROSE',
      submitBtnLabel: 'Unwrap tokens',
      firstBalance: wRoseBalanceString,
      secondBalance: roseBalanceString,
    },
  }

  const { firstInputLabel, secondInputLabel, submitBtnLabel, firstBalance, secondBalance } =
    labelMapByFormType[formType]
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
      <form className={'flex flex-col gap-7'} onSubmit={handleFormSubmit}>
        <div className={'flex flex-col gap-5'}>
          <div className={'flex flex-col gap-2'}>
            <Label htmlFor="field-1">From</Label>
            <div className={'flex flex-row gap-1 items-center'}>
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
              <span>{firstInputLabel}</span>
            </div>
            <Typography variant={'small'} className={'text-[var(--muted-foreground,#A1A1AA)]'}>
              Balance: {firstBalance}
            </Typography>
          </div>

          <div className={'flex flex-row items-center gap-4'}>
            <div className={'flex-1'}>
              <Separator />
            </div>
            <ToggleButton onClick={handleToggleFormType} disabled={isLoading} />
            <div className={'flex-1'}>
              <Separator />
            </div>
          </div>
          <div className={cn('flex flex-col gap-2')}>
            <Label htmlFor="field-2">To</Label>
            <div className={'flex flex-row gap-1 items-center'}>
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
              <span>{secondInputLabel}</span>
            </div>
            <Typography variant={'small'} className={'text-[var(--muted-foreground,#A1A1AA)]'}>
              Balance: {secondBalance}
            </Typography>
          </div>
        </div>

        <div className={'flex flex-row justify-between'}>
          <span>Estimated gas fee:</span>
          <span>{estimatedFeeTruncated}</span>
        </div>

        <div className={'flex flex-col gap-3'}>
          <Button variant="default" disabled={isLoading} type="submit" className="w-full">
            {submitBtnLabel}
          </Button>
          {error && (
            <Alert variant="destructive" className={'border-none p-0'}>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
        </div>
      </form>
      <WrapFeeWarningModal
        isOpen={isWrapFeeModalOpen}
        closeModal={() => setIsWrapFeeModalOpen(false)}
        next={submitWrapFeeModal}
      />
    </div>
  )
}
