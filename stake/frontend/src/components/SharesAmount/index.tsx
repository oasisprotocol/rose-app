import { FC, memo, ReactNode } from 'react'
import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { BIG_NUMBER_PLAIN_FORMAT, NumberUtils } from '../../utils/number.utils'
import { Amount } from '../Amount'
import { SharesType } from '../../types/shares-type'

interface Props {
  shares: BigNumber.Value | bigint
  validator: Validator
  type: SharesType
  className?: string
  children?: (amount: BigNumber | null) => ReactNode
}

export const SharesAmountCmp: FC<Props> = ({ children, shares, validator, type, className }) => {
  const amount = NumberUtils.getAmountFromShares(
    BigNumber.isBigNumber(shares) ? shares.toFormat(BIG_NUMBER_PLAIN_FORMAT) : shares.toString(),
    validator,
    type
  )

  if (typeof children === 'function') {
    return children(amount)
  }

  return <Amount className={className} amount={amount?.toFormat(BIG_NUMBER_PLAIN_FORMAT) ?? null} />
}

export const SharesAmount = memo(SharesAmountCmp)
