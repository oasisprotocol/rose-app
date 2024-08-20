import { FC } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { formatUnits } from 'ethers'

const supportedUnits = {
  nano: {
    decimals: 9,
    prefix: 'n',
  },
}

interface Props {
  amount: bigint | string
  className?: string
  unit?: 'nano'
}

export const Amount: FC<Props> = ({ amount, className, unit }) => {
  const {
    state: { nativeCurrency },
  } = useWeb3()

  const unitDecimals = unit ? supportedUnits[unit].decimals : 0
  const unitPrefix = unit ? supportedUnits[unit].prefix : ''

  return (
    <span className={StringUtils.clsx('body', classes.amount, className)}>
      {formatUnits(amount, (nativeCurrency?.decimals ?? 18) - unitDecimals)}&nbsp;{unitPrefix}
      {nativeCurrency?.symbol}
    </span>
  )
}
