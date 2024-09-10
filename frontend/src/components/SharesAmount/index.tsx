import { FC, memo } from 'react'
import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { NumberUtils } from '../../utils/number.utils'
import { Amount } from '../Amount'
import { SharesType } from '../../types/shares-type'

interface Props {
  shares: BigNumber.Value | bigint
  validator: Validator
  type: SharesType
}

export const SharesAmountCmp: FC<Props> = ({ shares, validator, type }) => {
  const amount = NumberUtils.getAmountFromShares(shares.toString(), validator, type)

  return <Amount amount={amount.toString()} />
}

export const SharesAmount = memo(SharesAmountCmp)
