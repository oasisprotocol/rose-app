import { ChangeEventHandler, FC, useId, useMemo, useRef, useState } from 'react'
import classes from './index.module.css'
import { Button } from '../Button'
import { amountPattern, StringUtils } from '../../utils/string.utils'
import { FunctionUtils } from '../../utils/function.utils'

interface PercentageEntry {
  label: string
  percentage: number
}

const percentageList: PercentageEntry[] = [
  {
    label: '25%',
    percentage: 0.25,
  },
  {
    label: '50%',
    percentage: 0.5,
  },
  {
    label: '75%',
    percentage: 0.75,
  },
  {
    label: 'All',
    percentage: 1,
  },
]

interface Props {
  required?: boolean
  label?: string
  error?: string
  className?: string
  onChange?: (opts: { value?: string; percentage?: number }) => void
  calcAmountFromPercentage: (percentage: number) => string
}

export const AmountInput: FC<Props> = ({
  required,
  label,
  error,
  className,
  onChange,
  calcAmountFromPercentage,
}) => {
  const id = useId()
  const ref = useRef<HTMLInputElement | null>(null)
  const [inputValue, setInputValue] = useState('')

  const percentageValues = useMemo(
    () => percentageList.map(({ percentage }) => calcAmountFromPercentage(percentage)),
    [calcAmountFromPercentage]
  )

  return (
    <div className={className}>
      <div className={classes.percentageInputs}>
        {percentageList.map(({ label }, i) => (
          <Button
            color="secondary"
            variant={inputValue === percentageValues[i] ? 'solid' : 'outline'}
            size="small"
            onClick={() => {
              setInputValue(percentageValues[i])
              onChange?.({ value: percentageValues[i] })

              if (ref.current) {
                ref.current.value = percentageValues[i]
              }
            }}
            key={label}
          >
            {label}
          </Button>
        ))}
      </div>
      <div className={classes.amountInput}>
        <input
          ref={ref}
          placeholder=" "
          id={id}
          required={required}
          onChange={FunctionUtils.debounce(
            (({ target: { value } }) => {
              setInputValue(value)
              onChange?.({ value })
            }) as ChangeEventHandler<HTMLInputElement>,
            100
          )}
          pattern={amountPattern}
          inputMode="decimal"
          autoComplete="off"
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && <p className={StringUtils.clsx('error', classes.amountInputError)}>{error}</p>}
    </div>
  )
}
