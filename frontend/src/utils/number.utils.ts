import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { CONSENSUS_DECIMALS } from '../constants/config'

export abstract class NumberUtils {
  // Compatible with https://github.com/MetaMask/metamask-extension/blob/v10.7.0/ui/helpers/utils/icon-factory.js#L84-L88
  static jsNumberForAddress(address: string) {
    const addr = address.slice(2, 10)
    return parseInt(addr, 16)
  }

  static getAmountFromShares(
    shares: BigNumber.Value,
    validator: Validator,
    denomination = CONSENSUS_DECIMALS
  ) {
    const rosePerShareRatio = BigNumber(validator.escrow.active_balance ?? 0).div(
      BigNumber(validator.escrow.active_shares ?? 0)
    )

    return BigNumber(shares.toString())
      .multipliedBy(rosePerShareRatio)
      .integerValue(BigNumber.ROUND_DOWN)
      .multipliedBy(10 ** denomination)
  }

  static orZeroBigInt(value: undefined | null | bigint) {
    return value ?? 0n
  }

  static orZeroNumber(value: undefined | null | number) {
    return value ?? 0
  }
}
