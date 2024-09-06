import { FC, memo } from 'react'
import classes from './index.module.css'
import { Undelegation, Undelegations } from '../../types'
import { Table } from '../Table'
import { Validator } from '../Validator'
import { StringUtils } from '../../utils/string.utils'
import { Button } from '../Button'
import { useGrpc } from '../../hooks/useGrpc'
import { EpochTimeEstimate } from '../EpochTimeEstimate'
import { HourglassIcon } from '../icons/HourglassIcon'
import { SuccessIcon } from '../icons/SuccessIcon'
import { ToggleButton } from '../ToggleButton'
import { SharesAmount } from '../SharesAmount'

type DebondingItemStatus = 'ready' | 'waiting' | null

type DebondingItem = Undelegation & {
  status: DebondingItemStatus
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
  } = useGrpc()

  const debondingItems: DebondingItem[] = undelegations.map(({ from, shares, epoch }) => {
    return {
      from,
      shares,
      epoch,
      status: getDebondingItemStatus(epoch, consensusStatus?.latest_epoch),
    } satisfies DebondingItem
  })

  return (
    <div className={classes.debondingTab}>
      <Table data={debondingItems} isExpandable>
        {({ entry, isExpanded, toggleRow }) => (
          <Validator key={entry.from + entry.epoch} address={entry.from} fallback={<tr />}>
            {validator => (
              <>
                <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined, classes.debondingRow)}>
                  <td>
                    <p className="body">{StringUtils.getValidatorFriendlyName(validator)}</p>
                  </td>
                  <td>
                    {!isExpanded && (
                      <>
                        {entry.status === 'waiting' && (
                          <div className={classes.rowStatusWaiting}>
                            <HourglassIcon />
                          </div>
                        )}
                        {entry.status === 'ready' && (
                          <SuccessIcon className={classes.successIcon} label="Available to claim" />
                        )}
                      </>
                    )}
                  </td>
                  <td>
                    <SharesAmount shares={entry.shares} validator={validator} />
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
                            <SharesAmount shares={entry.shares} validator={validator} />
                          </p>
                        </div>
                      )}
                      <div className={classes.debondingRowActions}>
                        {entry.status === 'ready' && (
                          <div className={classes.debondingReady}>
                            <div className={StringUtils.clsx(classes.infoBox, classes.infoBoxSuccess)}>
                              <p className="body">
                                Your <SharesAmount shares={entry.shares} validator={validator} /> is
                                available.
                              </p>
                            </div>
                          </div>
                        )}
                        {entry.status === 'waiting' && (
                          <div className={classes.infoBox}>
                            <HourglassIcon />
                            <p>
                              Estimated to be available on <EpochTimeEstimate epoch={entry.epoch} />
                            </p>

                            <Button
                              size="small"
                              variant="text"
                              onClick={() => {
                                throw new Error('Not implemented')
                              }}
                              className={classes.scheduleBtn}
                            >
                              Remind me
                            </Button>
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
    </div>
  )
}

export const DebondingTab = memo(DebondingTabCmp)
