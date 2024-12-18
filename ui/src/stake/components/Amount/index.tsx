import { FC } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { CONSENSUS_DECIMALS } from '../../utils/number.utils'
import { NumberUtils } from '../../utils/number.utils'
import { useAccount } from 'wagmi'

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
  amount: bigint | string | null
  className?: string
  unit?: 'nano' | 'consensus'
}

export const Amount: FC<Props> = ({ amount, className, unit }) => {
  const { chain } = useAccount()
  const nativeCurrency = chain?.nativeCurrency

  const unitDecimals = unit ? supportedUnits[unit].decimals : null
  const unitPrefix = unit ? supportedUnits[unit].prefix : ''

  return (
    <span className={StringUtils.clsx('body', classes.amount, className)}>
      {amount === null && <>Invalid amount</>}
      {amount !== null && (
        <>
          <span className="ellipsis">
            {NumberUtils.formatAmount(amount, unitDecimals ?? nativeCurrency?.decimals ?? 18)}
          </span>
          &nbsp;{unitPrefix}
          {nativeCurrency?.symbol}
        </>
      )}
    </span>
  )
}
