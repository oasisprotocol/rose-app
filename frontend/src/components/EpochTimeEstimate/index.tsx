import { FC, memo, Suspense } from 'react'
import { useGrpc } from '../../hooks/useGrpc'
import { DateUtils } from '../../utils/date.utils'
import { PromiseUtils } from '../../utils/promise.utils'

interface TimeEstimateProps {
  getTimeEstimate: () => Date | null
}

const TimeEstimate: FC<TimeEstimateProps> = ({ getTimeEstimate }) => {
  const timeEstimate = getTimeEstimate()

  if (!timeEstimate) return null

  return DateUtils.intlDateFormat(timeEstimate, { format: 'long' })
}

interface Props {
  epoch: bigint
}

const EpochTimeEstimateCmp: FC<Props> = ({ epoch }) => {
  const { getTimeEstimateForFutureEpoch } = useGrpc()
  const wTimeEstimate = PromiseUtils.wrapPromise(getTimeEstimateForFutureEpoch(epoch))

  return (
    <Suspense fallback={<div>Calculating...</div>}>
      <TimeEstimate getTimeEstimate={wTimeEstimate} />
    </Suspense>
  )
}

export const EpochTimeEstimate = memo(EpochTimeEstimateCmp)
