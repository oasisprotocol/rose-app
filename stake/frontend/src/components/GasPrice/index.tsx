import { FC, memo, ReactNode, Suspense } from 'react'
import { PromiseUtils } from '../../utils/promise.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { Amount } from '../Amount'

interface FeeEstimateProps {
  children?: (gasPrice: bigint | null) => ReactNode
  getGasPrice: () => bigint
}

const FormatGasPrice: FC<FeeEstimateProps> = ({ getGasPrice, children }) => {
  const gasPrice = getGasPrice()

  if (!gasPrice) return null

  if (typeof children === 'function') {
    return children(gasPrice)
  }

  return <Amount amount={gasPrice} unit="nano" />
}

interface Props {
  gasPrice?: bigint
  children?: (gasPrice: bigint | null) => ReactNode
}

const GasPriceCmp: FC<Props> = ({ gasPrice, children }) => {
  const { getGasPrice } = useWeb3()
  const wGasPrice = PromiseUtils.wrapPromise(
    !!gasPrice && gasPrice >= 0n ? Promise.resolve(gasPrice) : getGasPrice()
  )

  return (
    <Suspense fallback={children?.(null) ?? <>...</>}>
      <FormatGasPrice getGasPrice={wGasPrice} children={children} />
    </Suspense>
  )
}

export const GasPrice = memo(GasPriceCmp)
