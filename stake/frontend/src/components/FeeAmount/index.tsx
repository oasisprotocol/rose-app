import { FC, memo } from 'react'
import { Amount } from '../Amount'
import { useEstimateFeesPerGas } from 'wagmi'

interface Props {
  gasLimit: bigint
  gasPrice?: bigint
}

const FeeAmountCmp: FC<Props> = ({ gasLimit, gasPrice }) => {
  const { data, isLoading } = useEstimateFeesPerGas({ type: 'legacy', query: { enabled: !gasPrice } })
  const _gasPrice = gasPrice ?? data?.gasPrice

  if (isLoading) return <>...</>

  if (!_gasPrice) return null

  return <Amount amount={_gasPrice * gasLimit} />
}

export const FeeAmount = memo(FeeAmountCmp)
