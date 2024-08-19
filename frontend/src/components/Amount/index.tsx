import { FC } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { formatUnits } from 'ethers'

interface Props {
  amount: bigint | string
  className?: string
}

export const Amount: FC<Props> = ({ amount, className }) => {
  const {
    state: { nativeCurrency },
  } = useWeb3()

  return (
    <span className={StringUtils.clsx('body', classes.amount, className)}>
      {formatUnits(amount, nativeCurrency?.decimals)}&nbsp;{nativeCurrency?.symbol}
    </span>
  )
}
