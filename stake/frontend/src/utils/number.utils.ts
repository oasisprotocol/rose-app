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

  /**
   * Calculates the amount of currency from given shares.
   *
   * @param {BigNumber.Value} shares - The number of shares.
   * @param {Validator} validator - The validator object.
   * @param {SharesType} type - The type of shares ('staking' or 'unstaking').
   * @param {number} [denomination=CONSENSUS_DECIMALS] - The denomination of the currency.
   * @returns {BigNumber | null} - The calculated amount of currency or null if shares/validator data are invalid.
   */
  static getAmountFromShares(
    shares: BigNumber.Value,
    validator: Validator,
    type: SharesType,
    denomination = CONSENSUS_DECIMALS
  ): BigNumber | null {
    let rosePerShareRatio = BigNumber(0)

    if (type === 'staking') {
      const activeShares = BigNumber(validator.escrow.active_shares ?? 0)

      if (activeShares.eq(0)) {
        return null
      }

      rosePerShareRatio = BigNumber(validator.escrow.active_balance ?? 0).div(activeShares)
    } else if (type === 'unstaking') {
      const debondingShares = BigNumber(validator.escrow.debonding_shares ?? 0)

      if (debondingShares.eq(0)) {
        return null
      }

      rosePerShareRatio = BigNumber(validator.escrow.debonding_balance ?? 0).div(debondingShares)
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
