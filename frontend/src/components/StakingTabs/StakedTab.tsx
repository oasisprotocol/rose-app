import { FC, Fragment, memo } from 'react'
import { Delegations, PendingDelegations } from '../../types'
import { Table } from '../Table'
import { Validator } from '../Validator'
import { StringUtils } from '../../utils/string.utils'
import { Amount } from '../Amount'
import { formatUnits } from 'ethers'
import { Button } from '../Button'
import { useWeb3 } from '../../hooks/useWeb3'
import { ArrowDownIcon } from '../icons/ArrowDownIcon'
import { ActiveIcon } from '../icons/ActiveIcon'
import classes from './index.module.css'
import { InactiveIcon } from '../icons/InactiveIcon'
import { WarnIcon } from '../icons/WarnIcon'
import { Notification } from '../Notification'

type PendingDelegationStakedItem = {
  receiptId: bigint
  from: string
  to: string
  amount: bigint
}

type DelegationStakedItem = {
  to: string
  amount: bigint
  shares: bigint
}

const isDelegationStakedItem = (object: Partial<DelegationStakedItem>): object is DelegationStakedItem => {
  return 'shares' in object
}

type StakedItem = (PendingDelegationStakedItem | DelegationStakedItem) & { key: string }

interface Props {
  pendingDelegations: PendingDelegations
  delegations: Delegations
}

const StakedTabCmp: FC<Props> = ({ pendingDelegations, delegations }) => {
  const { delegateDone, undelegate } = useWeb3()

  const pendingDelegationsNormalized: StakedItem[] = pendingDelegations.receiptIds.map((receiptId, i) => {
    const { amount, from, to } = pendingDelegations.pendings[i]

    return {
      receiptId,
      amount,
      from,
      to,
      key: receiptId.toString(),
    } satisfies StakedItem
  })
  const delegationsNormalized: StakedItem[] = delegations.out_delegates.map((to, i) => {
    const { amount, shares } = delegations.out_delegations[i]

    return {
      to,
      amount,
      shares,
      key: `${to}${i}`,
    } satisfies StakedItem
  })
  const stakedItems = [...pendingDelegationsNormalized, ...delegationsNormalized]

  return (
    <div className={classes.stakedTab}>
      <Table data={stakedItems} isExpandable>
        {({ entry, isExpanded, toggleRow }) => {
          const isPendingDelegation = !isDelegationStakedItem(entry)

          return (
            <Validator key={entry.key} address={entry.to} fallback={<tr />}>
              {validator => (
                <Fragment>
                  <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined, classes.stakedRow)}>
                    <td>
                      <p className="body">
                        {StringUtils.getValidatorFriendlyName(validator)}
                        {isPendingDelegation && <Notification small />}
                      </p>
                    </td>
                    <td>
                      {isPendingDelegation && <WarnIcon label={!isExpanded ? 'Confirm stake' : undefined} />}
                    </td>
                    <td>
                      <Amount amount={entry.amount} />
                    </td>
                    <td>
                      <button
                        className={StringUtils.clsx(classes.toggleBtn, isExpanded ? 'open' : undefined)}
                        onClick={toggleRow}
                      >
                        <ArrowDownIcon />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={classes.expandedRow}>
                      <td colSpan={4}>
                        <div className={classes.stakedRowValidatorDetails}>
                          <p className="body">
                            <span>Status:</span>
                            <span>
                              {validator.active ? (
                                <>
                                  Active&nbsp;&nbsp;
                                  <ActiveIcon />
                                </>
                              ) : (
                                <>
                                  Inactive&nbsp;&nbsp;
                                  <InactiveIcon />
                                </>
                              )}
                            </span>
                          </p>
                          <p className="body">
                            <span>Rank:</span>
                            <span>{validator.rank ? `#${validator.rank}` : '-'}</span>
                          </p>
                          <p className="body">
                            <span>Commission:</span>
                            <span>{formatUnits(validator.current_rate * 100, 2)}&nbsp;%</span>
                          </p>
                        </div>
                        <div className={classes.stakedRowActions}>
                          {!isPendingDelegation && (
                            <div>
                              {/*TODO: Navigate to undelegate page*/}
                              <Button
                                onClick={() => undelegate(entry.shares, entry.to)}
                                className={classes.unstakeBtn}
                              >
                                Unstake
                              </Button>
                            </div>
                          )}
                          {isPendingDelegation && (
                            <div>
                              <p className="body">
                                You are not staking as you have not confirmed the stake yet.
                              </p>
                              <Button
                                onClick={() => delegateDone(entry.receiptId)}
                                className={classes.confirmStakeBtn}
                              >
                                Confirm stake
                              </Button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )}
            </Validator>
          )
        }}
      </Table>
    </div>
  )
}

export const StakedTab = memo(StakedTabCmp)
