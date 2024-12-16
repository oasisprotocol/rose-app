import { FC } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

interface Props {
  value: bigint
  dp?: number
  formatDp?: number
}

const formatAmount = (amount: bigint | string, dp: number, formatDp = 3): string => {
  return BigNumber(formatUnits(BigInt(amount), dp))
    .dp(formatDp, BigNumber.ROUND_DOWN)
    .toFormat(formatDp)
}

export const Amount: FC<Props> = ({ value, dp, formatDp = 3 }) => {
  const { chain } = useAccount()
  const nativeCurrency = chain?.nativeCurrency

  if (!nativeCurrency) return null

  const _dp = dp ?? nativeCurrency?.decimals

  const formattedAmount = formatAmount(value, _dp, formatDp)

  return (
    <span>
      {formattedAmount}&nbsp;<b>{nativeCurrency.symbol}</b>
    </span>
  )
}
