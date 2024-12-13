import { FC, memo, ReactNode } from 'react'
import { Amount } from '../Amount'
import { useEstimateFeesPerGas } from 'wagmi'

interface Props {
  gasPrice?: bigint
  children?: (gasPrice: bigint | undefined) => ReactNode
}

const GasPriceCmp: FC<Props> = ({ gasPrice, children }) => {
  const { data, isLoading } = useEstimateFeesPerGas({ type: 'legacy', query: { enabled: !gasPrice } })
  const _gasPrice = gasPrice ?? data?.gasPrice

  if (isLoading) return <>...</>

  if (!_gasPrice) return undefined

  if (typeof children === 'function') {
    return children(_gasPrice)
  }

  return <Amount amount={_gasPrice} unit="nano" />
}

export const GasPrice = memo(GasPriceCmp)
