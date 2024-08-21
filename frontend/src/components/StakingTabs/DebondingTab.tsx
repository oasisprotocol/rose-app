import { FC, memo } from 'react'
import classes from './index.module.css'
import { Undelegations } from '../../types'
import { Table } from '../Table'
import { Validator } from '../Validator'
import { StringUtils } from '../../utils/string.utils'
import { Amount } from '../Amount'
import { Button } from '../Button'
import { useWeb3 } from '../../hooks/useWeb3'
import { useGrpc } from '../../hooks/useGrpc'
import { EpochTimeEstimate } from '../EpochTimeEstimate'
import { HourglassIcon } from '../icons/HourglassIcon'
import { SuccessIcon } from '../icons/SuccessIcon'
import { Notification } from '../Notification'
import { ToggleButton } from '../ToggleButton'

type DebondingItemStatus = 'ready' | 'waiting' | 'pending' | null

type DebondingItem = {
  receiptId: bigint
  from: string
  to: string
  shares: bigint
  costBasis: bigint
  endReceiptId: bigint
  epoch: bigint
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

  if (epoch === 0n) {
    return 'pending'
  }

  if (epoch <= latestEpoch) {
    return 'ready'
  }

  return 'waiting'
}

const DebondingTabCmp: FC<Props> = ({ undelegations }) => {
  const { undelegateStart, undelegateDone } = useWeb3()
  const {
    state: { consensusStatus },
  } = useGrpc()

  const debondingItems: DebondingItem[] = undelegations.receiptIds.map((receiptId, i) => {
    const { from, to, shares, costBasis, endReceiptId, epoch } = undelegations.undelegations[i]

    return {
      receiptId,
      from,
      to,
      shares,
      costBasis,
      endReceiptId,
      epoch,
      status: getDebondingItemStatus(epoch, consensusStatus?.latest_epoch),
    } satisfies DebondingItem
  })

  return (
    <div className={classes.debondingTab}>
      <Table data={debondingItems} isExpandable>
        {({ entry, isExpanded, toggleRow }) => (
          <Validator key={entry.receiptId} hexAddress={entry.from} fallback={<tr />}>
            {validator => (
              <>
                <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined, classes.debondingRow)}>
                  <td>
                    <p className="body">
                      {StringUtils.getValidatorFriendlyName(validator)}
                      {['pending', 'ready'].includes(entry.status!) && <Notification small />}
                    </p>
                  </td>
                  <td>
                    {!isExpanded && (
                      <>
                        {['pending', 'waiting'].includes(entry.status!) && (
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
                    <Amount amount={entry.costBasis} />
                  </td>
                  <td>
                    <ToggleButton isExpanded={!!isExpanded} toggleRow={toggleRow} />
                  </td>
                </tr>
                {isExpanded && (
                  <tr className={classes.expandedRow}>
                    <td colSpan={4}>
                      {['pending', 'waiting'].includes(entry.status!) && (
                        <div className={classes.debondingRowExpanded}>
                          <p className="body">
                            <span>Expected amount:</span>
                            <Amount amount={entry.costBasis} />
                          </p>
                        </div>
                      )}
                      <div className={classes.debondingRowActions}>
                        {entry.status === 'ready' && (
                          <div className={classes.debondingReady}>
                            <div className={StringUtils.clsx(classes.infoBox, classes.infoBoxSuccess)}>
                              <p className="body">
                                Your <Amount amount={entry.costBasis} /> is available to be claimed.
                              </p>
                            </div>
                            <div>
                              <Button
                                onClick={() => undelegateDone(entry.receiptId)}
                                className={classes.claimNowBtn}
                              >
                                Claim now
                              </Button>
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
                        {entry.status === 'pending' && (
                          <div className={classes.infoBox}>
                            <HourglassIcon />
                            <p>Sign to verify arrival estimate</p>

                            <Button
                              size="small"
                              variant="text"
                              onClick={() => undelegateStart(entry.receiptId)}
                              className={classes.checkEstimatedTimeBtn}
                            >
                              Check estimated time
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
