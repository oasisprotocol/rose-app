import { FC, useId, useState } from 'react'
import classes from './index.module.css'
import { Button } from '../Button'
import { formatUnits } from 'ethers'
import { useWeb3 } from '../../hooks/useWeb3'
import { amountPattern } from '../../utils/string.utils'

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
  value?: string | bigint
  required?: boolean
  label?: string
  onChange?: (opts: { value?: Props['value']; percentage?: number }) => void
}

export const AmountInput: FC<Props> = ({ value, required, label, onChange }) => {
  const {
    state: { nativeCurrency },
  } = useWeb3()
  const id = useId()

  const [amount, setAmount] = useState(value ? formatUnits(value ?? '', nativeCurrency?.decimals) : '')

  return (
    <div>
      <div className={classes.percentageInputs}>
        {percentageList.map(({ label, percentage }) => (
          <Button variant="outline" onClick={() => onChange?.({ percentage })} key={label}>
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
            setAmount(targetValue)
          }}
          pattern={amountPattern}
          inputMode="decimal"
        />
        <label htmlFor={id}>{label}</label>
      </div>
    </div>
  )
}
