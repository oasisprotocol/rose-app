import { FC, memo } from 'react'
import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { NumberUtils } from '../../utils/number.utils'
import { Amount } from '../Amount'

interface Props {
  shares: BigNumber.Value | bigint
  validator: Validator
}

export const SharesAmountCmp: FC<Props> = ({ shares, validator }) => {
  const amount = NumberUtils.getAmountFromShares(shares.toString(), validator)

  return <Amount amount={amount.toString()} />
}

export const SharesAmount = memo(SharesAmountCmp)
