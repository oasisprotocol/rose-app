import { ChangeEventHandler, forwardRef, ForwardRefRenderFunction, useId } from 'react'
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
}

const AmountInputCmp: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { required, label, error, className, onChange },
  ref
) => {
  const id = useId()

  return (
    <div className={className}>
      <div className={classes.percentageInputs}>
        {percentageList.map(({ label, percentage }) => (
          <Button
            color="secondary"
            variant="outline"
            size="small"
            onClick={() => onChange?.({ percentage })}
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

export const AmountInput = forwardRef<HTMLInputElement, Props>(AmountInputCmp)
