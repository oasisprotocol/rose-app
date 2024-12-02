import { FC, memo, useEffect, useState } from 'react'
import classes from './index.module.css'
import { Undelegation, Undelegations } from '../../types'
import { Table } from '../Table'
import { Validator } from '../Validator'
import { StringUtils } from '../../utils/string.utils'
import { Button } from '../Button'
import { useGrpc } from '../../hooks/useGrpc'
import { HourglassIcon } from '../icons/HourglassIcon'
import { SuccessIcon } from '../icons/SuccessIcon'
import { ToggleButton } from '../ToggleButton'
import { SharesAmount } from '../SharesAmount'
import { EmptyTableData } from '../EmptyTableData'
import { CalendarUtils } from '../../utils/calendar.utils'
import { NumberUtils } from '../../utils/number.utils'
import { startOfDay } from 'date-fns/startOfDay'
import { endOfDay } from 'date-fns/endOfDay'
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip'
import { DateUtils } from '../../utils/date.utils'
import { useAppState } from '../../hooks/useAppState'
import { useAccount } from 'wagmi'

type DebondingItemStatus = 'ready' | 'waiting' | null

type DebondingItem = Undelegation & {
  status: DebondingItemStatus
  debondTimeEstimate: Date | null
}

interface Props {
  undelegations: Undelegations
}

const getDebondingItemStatus = (
  epoch: DebondingItem['epoch'],
  latestEpoch?: number | bigint
): DebondingItemStatus => {
  if (!latestEpoch) {
    return null
  }

  if (epoch <= latestEpoch) {
    return 'ready'
  }

  return 'waiting'
}

const DebondingTabCmp: FC<Props> = ({ undelegations }) => {
  const {
    state: { consensusStatus },
    getTimeEstimateForFutureEpoch,
  } = useGrpc()
  const { chain } = useAccount()
  const nativeCurrency = chain?.nativeCurrency
  const {
    state: { isMobileScreen, isDesktopScreen },
  } = useAppState()
  const [debondingItems, setDebondingItems] = useState<DebondingItem[] | null>(null)

  useEffect(() => {
    const init = async () => {
      const debondTimeEstimates = await Promise.all(
        undelegations.map(({ epoch }) => getTimeEstimateForFutureEpoch(epoch))
      )

      setDebondingItems(
        undelegations.map(({ from, shares, epoch }, i) => {
          return {
            from,
            shares,
            epoch,
            status: getDebondingItemStatus(epoch, consensusStatus?.latest_epoch),
            debondTimeEstimate: debondTimeEstimates[i],
          } satisfies DebondingItem
        })
      )
    }

    init()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undelegations, consensusStatus?.latest_epoch])

  if (debondingItems === null) return null

  return (
    <div className={classes.debondingTab}>
      {debondingItems.length === 0 && (
        <EmptyTableData>
          <p>There are no debonding records.</p>
        </EmptyTableData>
      )}
      {debondingItems.length > 0 && (
        <Table data={debondingItems} isExpandable maxHeight={458}>
          {({ entry, isExpanded, toggleRow }) => (
            <Validator key={entry.from + entry.epoch} address={entry.from} fallback={<tr />}>
              {validator => (
                <>
                  <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined, classes.debondingRow)}>
                    <td>
                      <p className={StringUtils.clsx('body', 'ellipsis')}>
                        {isMobileScreen && (
                          <span className="mono">
                            {StringUtils.getValidatorFriendlyName(validator, { truncate: false })}
                          </span>
                        )}
                        {isDesktopScreen && (
                          <span className="mono">{StringUtils.getValidatorFriendlyName(validator)}</span>
                        )}
                        {isDesktopScreen && !validator.active && (
                          <>
                            &nbsp;
                            <span className="body mute">(inactive)</span>
                          </>
                        )}
                      </p>
                      {isMobileScreen && !validator.active && (
                        <p className="body mute">
                          <span>(inactive)</span>
                        </p>
                      )}
                    </td>
                    <td>
                      {!isExpanded && (
                        <>
                          {entry.status === 'waiting' && (
                            <div className={classes.rowStatusWaiting}>
                              {entry.debondTimeEstimate && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <HourglassIcon />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Expected to be available on
                                    <br />
                                    {DateUtils.intlDateFormat(entry.debondTimeEstimate, { format: 'short' })}
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          )}
                          {entry.status === 'ready' && <SuccessIcon label="Available to claim" />}
                        </>
                      )}
                    </td>
                    <td>
                      <SharesAmount shares={entry.shares} validator={validator} type="unstaking" />
                    </td>
                    <td>
                      <ToggleButton isExpanded={!!isExpanded} toggleRow={toggleRow} />
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={classes.expandedRow}>
                      <td colSpan={4}>
                        {entry.status === 'waiting' && (
                          <div className={classes.debondingRowExpanded}>
                            <p className="body">
                              <span>Expected amount:</span>
                              <SharesAmount
                                className={classes.debondingRowExpandedAmount}
                                shares={entry.shares}
                                validator={validator}
                                type="unstaking"
                              />
                            </p>
                          </div>
                        )}
                        <div className={classes.debondingRowActions}>
                          {entry.status === 'ready' && (
                            <div className={classes.debondingReady}>
                              <div className={StringUtils.clsx(classes.infoBox, classes.infoBoxSuccess)}>
                                <p className="body">
                                  Your{' '}
                                  <SharesAmount
                                    shares={entry.shares}
                                    validator={validator}
                                    type="unstaking"
                                  />{' '}
                                  is available.
                                </p>
                              </div>
                            </div>
                          )}
                          {entry.status === 'waiting' && (
                            <div className={classes.infoBox}>
                              {entry.debondTimeEstimate && (
                                <>
                                  <HourglassIcon />
                                  <p>
                                    Estimated to be available on {isMobileScreen && <br />}
                                    {DateUtils.intlDateFormat(entry.debondTimeEstimate, { format: 'short' })}
                                  </p>
                                </>
                              )}

                              <SharesAmount shares={entry.shares} validator={validator} type="unstaking">
                                {amount => {
                                  if (amount === null) return null
                                  if (entry.debondTimeEstimate === null) return null

                                  const formattedAmount = `${NumberUtils.formatAmount(amount.toFixed(0), 18)} ${nativeCurrency?.symbol}`
                                  const validatorFriendlyName =
                                    StringUtils.getValidatorFriendlyName(validator)

                                  return (
                                    <a
                                      href={CalendarUtils.addGoogleCalendarEventLink(
                                        `Unstaking of ${formattedAmount} from ${validatorFriendlyName} completed`,
                                        startOfDay(entry.debondTimeEstimate),
                                        endOfDay(entry.debondTimeEstimate),
                                        window.location.href,
                                        `Your stake in amount of ${formattedAmount} will be automatically withdrawn from validator ${validatorFriendlyName} today.`
                                      )}
                                      target="_blank"
                                      rel="nofollow"
                                    >
                                      <Button size="small" variant="text" className={classes.scheduleBtn}>
                                        Remind me
                                      </Button>
                                    </a>
                                  )
                                }}
                              </SharesAmount>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </Validator>
          )}
        </Table>
      )}
    </div>
  )
}

export const DebondingTab = memo(DebondingTabCmp)
