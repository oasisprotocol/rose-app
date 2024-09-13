import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { CONSENSUS_DECIMALS, NEXUS_COMMISSION_RATE_DECIMALS } from '../constants/config'
import { SharesType } from '../types/shares-type'
import { formatUnits, Numeric } from 'ethers'

export abstract class NumberUtils {
  // Compatible with https://github.com/MetaMask/metamask-extension/blob/v10.7.0/ui/helpers/utils/icon-factory.js#L84-L88
  static jsNumberForAddress(address: string) {
    const addr = address.slice(2, 10)
    return parseInt(addr, 16)
  }

  static getAmountFromShares(
    shares: BigNumber.Value,
    validator: Validator,
    type: SharesType,
    denomination = CONSENSUS_DECIMALS
  ) {
    let rosePerShareRatio = BigNumber(0)

    if (type === 'staking') {
      rosePerShareRatio = BigNumber(validator.escrow.active_balance ?? 0).div(
        BigNumber(validator.escrow.active_shares ?? 0)
      )
    } else if (type === 'unstaking') {
      rosePerShareRatio = BigNumber(validator.escrow.debonding_balance ?? 0).div(
        BigNumber(validator.escrow.debonding_shares ?? 0)
      )
    }

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

  static formatValidatorRate(rate: number, dp = 2) {
    return BigNumber(rate)
      .dividedBy(10 ** (NEXUS_COMMISSION_RATE_DECIMALS - dp))
      .toFormat(dp, BigNumber.ROUND_DOWN)
  }

  static consensusAmountToSapphireAmount(amount: bigint) {
    return amount * 10n ** BigInt(CONSENSUS_DECIMALS)
  }

  static formatAmount(amount: bigint | string, dp: Numeric | string): string {
    return BigNumber(formatUnits(amount, dp)).dp(2, BigNumber.ROUND_DOWN).toFormat(2)
  }
}
