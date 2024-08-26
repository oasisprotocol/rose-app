import { FC, useId } from 'react'
import classes from './index.module.css'
import { Button } from '../Button'
import { formatUnits } from 'ethers'
import { amountPattern } from '../../utils/string.utils'
import BigNumber from 'bignumber.js'
import { CONSENSUS_DECIMALS } from '../../constants/config'

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
  value?: string | bigint | BigNumber
  required?: boolean
  label?: string
  decimals?: number
  onChange?: (opts: { value?: Props['value']; percentage?: number }) => void
}

export const AmountInput: FC<Props> = ({
  value,
  required,
  label,
  decimals = CONSENSUS_DECIMALS,
  onChange,
}) => {
  const id = useId()

  const amount = value ? formatUnits(value.toString(), decimals) : ''

  return (
    <div>
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
          placeholder=" "
          id={id}
          required={required}
          value={amount}
          onChange={({ target: { value: targetValue } }) => {
            onChange?.({ value: targetValue })
          }}
          pattern={amountPattern}
          inputMode="decimal"
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  )
}
