import { FC, memo, ReactElement, Suspense } from 'react'
import { useGrpc } from '../../hooks/useGrpc'
import { DateUtils } from '../../utils/date.utils'
import { PromiseUtils } from '../../utils/promise.utils'
import { formatDistance } from 'date-fns'

interface TimeEstimateProps {
  distance?: boolean
  getTimeEstimate: () => Date | null
  children?: (estimatedDate: Date | null) => ReactElement
}

const TimeEstimate: FC<TimeEstimateProps> = ({ children, getTimeEstimate, distance }) => {
  const timeEstimate = getTimeEstimate()

  if (children) {
    return children(timeEstimate)
  }

  if (!timeEstimate) return null

  if (distance) return formatDistance(new Date(), timeEstimate)

  return DateUtils.intlDateFormat(timeEstimate, { format: 'short' })
}

interface Props {
  epoch: bigint
  distance?: boolean
  children?: TimeEstimateProps['children']
}

const EpochTimeEstimateCmp: FC<Props> = ({ children, epoch, distance }) => {
  const { getTimeEstimateForFutureEpoch } = useGrpc()
  const wTimeEstimate = PromiseUtils.wrapPromise(getTimeEstimateForFutureEpoch(epoch))

  return (
    <Suspense fallback={<span>Calculating...</span>}>
      <TimeEstimate getTimeEstimate={wTimeEstimate} distance={distance}>
        {children}
      </TimeEstimate>
    </Suspense>
  )
}

export const EpochTimeEstimate = memo(EpochTimeEstimateCmp)
