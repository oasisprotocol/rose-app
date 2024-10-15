import { FC, memo, Suspense } from 'react'
import { PromiseUtils } from '../../utils/promise.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { Amount } from '../Amount'

interface FeeEstimateProps {
  getGasPrice: () => bigint
}

const FormatGasPrice: FC<FeeEstimateProps> = ({ getGasPrice }) => {
  const gasPrice = getGasPrice()

  if (!gasPrice) return null

  return <Amount amount={gasPrice} unit="nano" />
}

interface Props {
  gasPrice?: bigint
}

const GasPriceCmp: FC<Props> = ({ gasPrice }) => {
  const { getGasPrice } = useWeb3()
  const wGasPrice = PromiseUtils.wrapPromise(
    !!gasPrice && gasPrice >= 0n ? Promise.resolve(gasPrice) : getGasPrice()
  )

  return (
    <Suspense fallback={<>...</>}>
      <FormatGasPrice getGasPrice={wGasPrice} />
    </Suspense>
  )
}

export const GasPrice = memo(GasPriceCmp)
