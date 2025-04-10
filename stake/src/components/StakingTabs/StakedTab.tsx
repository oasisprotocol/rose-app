import { FC, Fragment, memo } from 'react'
import { Delegations } from '../../types'
import {
  ActiveIcon,
  Button,
  EmptyTableData,
  InactiveIcon,
  NumberUtils,
  SharesAmount,
  StringUtils,
  Table,
  ToggleButton,
} from '@oasisprotocol/rose-app-ui/stake'
import { Validator } from '../Validator'
import { useWeb3 } from '../../hooks/useWeb3'
import classes from './index.module.css'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import { useAccount } from 'wagmi'

interface Props {
  delegations: Delegations
}

const StakedTabCmp: FC<Props> = ({ delegations }) => {
  const { chain } = useAccount()
  const nativeCurrency = chain?.nativeCurrency
  const navigate = useNavigate()
  const {
    state: { isInteractingWithChain },
  } = useWeb3()
  const {
    state: { isMobileScreen, isDesktopScreen },
  } = useAppState()

  return (
    <div className={classes.stakedTab}>
      {delegations.length === 0 && (
        <EmptyTableData>
          <p>You currently have no {nativeCurrency?.symbol} debonding.</p>
        </EmptyTableData>
      )}
      {delegations.length > 0 && (
        <Table data={delegations} isExpandable maxHeight={458}>
          {({ entry, isExpanded, toggleRow }) => (
            <Validator key={entry.to} address={entry.to} fallback={<tr />}>
              {validator => (
                <Fragment>
                  <tr className={StringUtils.clsx(isExpanded ? 'expanded' : undefined, classes.stakedRow)}>
                    <td>
                      <p className={StringUtils.clsx('body', 'ellipsis')}>
                        {isMobileScreen && (
                          <span className="mono">{StringUtils.getValidatorFriendlyName(validator)}</span>
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
                      <SharesAmount shares={entry.shares} validator={validator} type="staking" />
                    </td>
                    <td>
                      <ToggleButton isExpanded={!!isExpanded} toggleRow={toggleRow} />
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
                            <span>{NumberUtils.formatValidatorRate(validator.current_rate)}%</span>
                          </p>
                        </div>
                        <div className={classes.stakedRowActions}>
                          <div>
                            <Button
                              onClick={() => navigate(`/stake/unstake/${entry.to}`)}
                              className={classes.unstakeBtn}
                              disabled={isInteractingWithChain}
                            >
                              Unstake
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )}
            </Validator>
          )}
        </Table>
      )}
    </div>
  )
}

export const StakedTab = memo(StakedTabCmp)
