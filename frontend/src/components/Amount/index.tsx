import { FC } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { formatUnits } from 'ethers'
import { CONSENSUS_DECIMALS } from '../../constants/config'
import BigNumber from 'bignumber.js'

const supportedUnits = {
  nano: {
    decimals: 9,
    prefix: 'n',
  },
  consensus: {
    decimals: CONSENSUS_DECIMALS,
    prefix: '',
  },
}

interface Props {
  amount: bigint | string
  className?: string
  unit?: 'nano' | 'consensus'
}

export const Amount: FC<Props> = ({ amount, className, unit }) => {
  const {
    state: { nativeCurrency },
  } = useWeb3()

  const unitDecimals = unit ? supportedUnits[unit].decimals : null
  const unitPrefix = unit ? supportedUnits[unit].prefix : ''

  return (
    <span className={StringUtils.clsx('body', classes.amount, className)}>
      {BigNumber(formatUnits(amount, unitDecimals ?? nativeCurrency?.decimals ?? 18))
        .dp(2, BigNumber.ROUND_DOWN)
        .toFormat(2)}
      &nbsp;{unitPrefix}
      {nativeCurrency?.symbol}
    </span>
  )
}
