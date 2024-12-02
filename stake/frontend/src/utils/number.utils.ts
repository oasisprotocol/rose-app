import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import {
  CONSENSUS_DECIMALS,
  NEXUS_COMMISSION_RATE_DECIMALS,
  FEE_DEDUCTION_MULTIPLIER,
} from '../constants/config'
import { SharesType } from '../types/shares-type'
import { formatUnits } from 'viem'

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

  static sapphireAmountToConsensusAmount(amount: bigint) {
    return BigNumber(amount.toString())
      .div(10 ** CONSENSUS_DECIMALS)
      .integerValue(BigNumber.ROUND_DOWN)
  }

  static formatAmount(amount: bigint | string, dp: number): string {
    return BigNumber(formatUnits(BigInt(amount), dp))
      .dp(2, BigNumber.ROUND_DOWN)
      .toFormat(2)
  }

  static shouldShowFeeWarningModal({
    fee,
    amount,
    accountBalanceAmount,
  }: {
    fee: BigNumber | bigint
    amount: BigNumber | bigint
    accountBalanceAmount: BigNumber | bigint
  }) {
    const feeBN = BigNumber.isBigNumber(fee) ? fee : BigNumber(fee.toString())
    const amountBN = BigNumber.isBigNumber(amount) ? amount : BigNumber(amount.toString())
    const accountAmountBN = BigNumber.isBigNumber(accountBalanceAmount)
      ? accountBalanceAmount
      : BigNumber(accountBalanceAmount.toString())

    const multiplierDeductionFee = feeBN.times(FEE_DEDUCTION_MULTIPLIER)

    // Account balance should have enough amount left for fee retention to show modal
    // Edge case 0.051 - would only convert 0.001 if user confirms - same goes for the case bellow
    if (accountAmountBN.minus(multiplierDeductionFee).lte(0)) {
      return false
    }

    // Amount should be greater than fee retention to show modal
    if (amountBN.minus(multiplierDeductionFee).lte(0)) {
      return false
    }

    // Account balance has NOT enough amount left for future transactions
    return amountBN.plus(multiplierDeductionFee).gt(accountAmountBN)
  }
}
