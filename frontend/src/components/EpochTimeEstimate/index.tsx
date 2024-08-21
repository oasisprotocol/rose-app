import { FC, memo, Suspense } from 'react'
import { useGrpc } from '../../hooks/useGrpc'
import { DateUtils } from '../../utils/date.utils'
import { PromiseUtils } from '../../utils/promise.utils'
import { formatDistance } from 'date-fns'

interface TimeEstimateProps {
  distance?: boolean
  getTimeEstimate: () => Date | null
}

const TimeEstimate: FC<TimeEstimateProps> = ({ getTimeEstimate, distance }) => {
  const timeEstimate = getTimeEstimate()

  if (!timeEstimate) return null

  if (distance) return formatDistance(new Date(), timeEstimate)

  return DateUtils.intlDateFormat(timeEstimate, { format: 'short' })
}

interface Props {
  epoch: bigint
  distance?: boolean
}

const EpochTimeEstimateCmp: FC<Props> = ({ epoch, distance }) => {
  const { getTimeEstimateForFutureEpoch } = useGrpc()
  const wTimeEstimate = PromiseUtils.wrapPromise(getTimeEstimateForFutureEpoch(epoch))

  return (
    <Suspense fallback={<span>Calculating...</span>}>
      <TimeEstimate getTimeEstimate={wTimeEstimate} distance={distance} />
    </Suspense>
  )
}

export const EpochTimeEstimate = memo(EpochTimeEstimateCmp)
