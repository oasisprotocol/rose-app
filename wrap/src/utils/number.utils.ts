import { WRAP_FEE_DEDUCTION_MULTIPLIER } from '../constants/config'
import BigNumber from 'bignumber.js'
import { formatEther } from 'viem'

export abstract class NumberUtils {
  static BNtoBigInt(bn: BigNumber): bigint {
    return BigInt(bn.toFixed(0))
  }

  static BigIntToBN(i: bigint): BigNumber {
    return BigNumber(i.toString())
  }

  static getPercentageAmount(amount: BigNumber, percentage: BigNumber) {
    return amount.multipliedBy(percentage).div(100)
  }

  /**
   * Helper to round eth amount to 4 decimals
   * @param amount
   */
  static getTruncatedAmount(amount: BigNumber) {
    const remainder = amount.mod(1e14)
    const truncatedAmount = BigNumber(amount.toFixed(0)).minus(remainder)
    return formatEther(NumberUtils.BNtoBigInt(truncatedAmount))
  }

  // Compatible with https://github.com/MetaMask/metamask-extension/blob/v10.7.0/ui/helpers/utils/icon-factory.js#L84-L88
  static jsNumberForAddress(address: string) {
    const addr = address.slice(2, 10)
    return parseInt(addr, 16)
  }

  static shouldShowWrapFeeWarningModal({
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

    const multiplierDeductionFee = feeBN.times(WRAP_FEE_DEDUCTION_MULTIPLIER)

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

  static ensureNonNullBigNumber(amount: BigNumber | null): BigNumber {
    if (!amount) {
      return BigNumber(0)
    }

    return amount
  }
}
