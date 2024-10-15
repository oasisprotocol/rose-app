import { FC } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { Amount } from '../Amount'
import { useWeb3 } from '../../hooks/useWeb3'

interface Props {
  totalAmount: bigint
  availableAmount: bigint
  stakedAmount: bigint
  debondingAmount: bigint
}

export const OverviewTab: FC<Props> = ({ totalAmount, availableAmount, stakedAmount, debondingAmount }) => {
  const {
    state: { nativeCurrency },
  } = useWeb3()

  return (
    <div className={classes.overviewTab}>
      <p className={StringUtils.clsx('body', classes.total)}>
        <span>{nativeCurrency?.symbol}:</span>
        <span>
          <Amount amount={totalAmount} />
        </span>
      </p>
      <p className="body">
        <span>Available:</span>
        <span>
          <Amount amount={availableAmount} />
        </span>
      </p>
      <p className="body">
        <span>Staked:</span>
        <span>
          <Amount amount={stakedAmount} />
        </span>
      </p>
      <p className="body">
        <span>Debonding:</span>
        <span>
          <Amount amount={debondingAmount} />
        </span>
      </p>
    </div>
  )
}
