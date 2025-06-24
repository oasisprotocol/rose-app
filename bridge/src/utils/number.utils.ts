import { BigNumber } from 'bignumber.js'

export abstract class NumberUtils {
  static formatTokenAmount(amount: string, decimals: number, displayDecimals = 6): string {
    if (!amount || amount === '0') return '0'

    return BigNumber(amount)
      .dividedBy(BigNumber(10).pow(decimals))
      .dp(displayDecimals, BigNumber.ROUND_DOWN)
      .toFixed()
  }

  static formatTokenAmountWithSymbol(
    amount: string,
    decimals: number,
    symbol: string,
    displayDecimals = 6
  ): string {
    const formatted = this.formatTokenAmount(amount, decimals, displayDecimals)
    const cleanFormatted = BigNumber(formatted).toString() // Remove trailing zeros
    return `${cleanFormatted} ${symbol}`
  }

  static expandAmount(amount: string, decimals: number): string {
    if (!amount || amount === '0') return '0'

    return BigNumber(amount)
      .multipliedBy(BigNumber(10).pow(decimals))
      .integerValue(BigNumber.ROUND_DOWN)
      .toString()
  }

  static calculateGasFee(gasLimit: string | number, gasPrice: bigint): string {
    const gasFeeWei = BigNumber(gasPrice.toString()).multipliedBy(gasLimit.toString())
    return gasFeeWei.toString()
  }

  static formatGasFee(
    gasLimit: string | number,
    gasPrice: bigint,
    decimals: number,
    displayDecimals = 6
  ): string {
    const gasFeeWei = this.calculateGasFee(gasLimit, gasPrice)
    return this.formatTokenAmount(gasFeeWei, decimals, displayDecimals)
  }

  static formatGasFeeWithSymbol(
    gasLimit: string | number,
    gasPrice: bigint,
    nativeSymbol: string = '',
    decimals: number = 18,
    displayDecimals = 6
  ): string {
    const formatted = this.formatGasFee(gasLimit, gasPrice, decimals, displayDecimals)
    return `${formatted}${nativeSymbol ? ` ${nativeSymbol}` : ''}`
  }

  static compareAmounts(amount1: string, amount2: string): number {
    return BigNumber(amount1).comparedTo(BigNumber(amount2))
  }

  static isGreaterThan(amount1: string, amount2: string): boolean {
    return BigNumber(amount1).isGreaterThan(BigNumber(amount2))
  }

  static isGreaterThanOrEqual(amount1: string, amount2: string): boolean {
    return BigNumber(amount1).isGreaterThanOrEqualTo(BigNumber(amount2))
  }

  static isZero(amount: string): boolean {
    return BigNumber(amount).isZero()
  }

  static isValidAmount(amount: string): boolean {
    const bn = BigNumber(amount)
    return bn.isFinite() && !bn.isNaN() && bn.isPositive()
  }
}
