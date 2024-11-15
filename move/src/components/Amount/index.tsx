import { FC } from 'react'
import { useAccount } from 'wagmi'
import { formatAmount } from '../../utils/getBalances.ts'

interface Props {
  value: bigint
  dp?: number
  formatDp?: number
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
