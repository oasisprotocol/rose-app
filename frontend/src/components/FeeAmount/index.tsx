import { FC, memo, Suspense } from 'react'
import { PromiseUtils } from '../../utils/promise.utils'
import { useWeb3 } from '../../hooks/useWeb3'
import { MAX_GAS_LIMIT } from '../../constants/config'
import { Amount } from '../Amount'

interface FeeEstimateProps {
  getGasPrice: () => bigint
  gasLimit: bigint
}

const FeeEstimate: FC<FeeEstimateProps> = ({ getGasPrice, gasLimit }) => {
  const gasPrice = getGasPrice()

  if (!gasPrice) return null

  return <Amount amount={gasPrice * gasLimit} />
}

interface Props {
  gasLimit?: bigint
  gasPrice?: bigint
}

const FeeAmountCmp: FC<Props> = ({ gasLimit = MAX_GAS_LIMIT, gasPrice }) => {
  const { getGasPrice } = useWeb3()
  const wGasPrice = PromiseUtils.wrapPromise(
    !!gasPrice && gasPrice >= 0n ? Promise.resolve(gasPrice) : getGasPrice()
  )

  return (
    <Suspense fallback={<>...</>}>
      <FeeEstimate gasLimit={gasLimit} getGasPrice={wGasPrice} />
    </Suspense>
  )
}

export const FeeAmount = memo(FeeAmountCmp)
