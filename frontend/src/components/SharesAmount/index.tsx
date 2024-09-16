import { FC, memo, ReactNode } from 'react'
import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { NumberUtils } from '../../utils/number.utils'
import { Amount } from '../Amount'
import { SharesType } from '../../types/shares-type'

interface Props {
  shares: BigNumber.Value | bigint
  validator: Validator
  type: SharesType
  children?: (amount: BigNumber | null) => ReactNode
}

export const SharesAmountCmp: FC<Props> = ({ children, shares, validator, type }) => {
  const amount = NumberUtils.getAmountFromShares(shares.toString(), validator, type)

  if (typeof children === 'function') {
    return children(amount)
  }

  return <Amount amount={amount?.toString() ?? null} />
}

export const SharesAmount = memo(SharesAmountCmp)
