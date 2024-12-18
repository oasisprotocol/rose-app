import { FC, memo, ReactNode, Suspense } from 'react'
import { useGrpc } from '../../hooks/useGrpc'
import { DateUtils, PromiseUtils } from '@oasisprotocol/rose-app-ui/stake'
import { formatDistance } from 'date-fns'

interface TimeEstimateProps {
  distance?: boolean
  getTimeEstimate: () => Date | null
  children?: (estimatedDate: Date) => ReactNode
}

const TimeEstimate: FC<TimeEstimateProps> = ({ children, getTimeEstimate, distance }) => {
  const timeEstimate = getTimeEstimate()

  if (!timeEstimate) return null

  if (children) {
    return children(timeEstimate)
  }

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
