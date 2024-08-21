import { FC, useContext } from 'react'
import { Tabs } from '../Tabs'
import { Tab } from '../Tabs/Tab'
import { Panel } from '../Tabs/Panel'
import { TabsContextProvider } from '../Tabs/TabsContextProvider'
import { OverviewTab } from './OverviewTab'
import { StakedTab } from './StakedTab'
import { useAppState } from '../../hooks/useAppState'
import { DebondingTab } from './DebondingTab'
import { StringUtils } from '../../utils/string.utils'
import { Notification } from '../Notification'
import classes from './index.module.css'
import { TabsContext } from '../Tabs/TabsContext'
import { Button } from '../Button'
import { useNavigate } from 'react-router-dom'

export const StakingTabsCmp: FC = () => {
  const navigate = useNavigate()
  const {
    state: { stats, pendingDelegations, delegations, undelegations },
  } = useAppState()
  const [activeIndex] = useContext(TabsContext)

  const numOfTotalStakes = (stats?.numOfItems.numOfPendingStakes ?? 0) + (stats?.numOfItems.numOfStakes ?? 0)
  const numOfTotalDebondings =
    (stats?.numOfItems.numOfPendingDebondings ?? 0) + (stats?.numOfItems.numOfDebondings ?? 0)

  const navigateToStake = () => navigate('/stake')

  return (
    <>
      <div className={classes.tabsContainer}>
        <Tabs className={classes.tabs}>
          <Tab>
            <p className="body">Overview</p>
          </Tab>
          <Tab>
            <p className="body">
              Staked
              {numOfTotalStakes > 0 && (
                <span className={StringUtils.clsx(classes.mute)}>&nbsp;({numOfTotalStakes})</span>
              )}
              {(stats?.numOfItems.numOfPendingStakes ?? 0) > 0 && (
                <Notification>{stats?.numOfItems.numOfPendingStakes}</Notification>
              )}
            </p>
          </Tab>
          <Tab>
            <p className="body">
              Debonding
              {numOfTotalDebondings > 0 && (
                <span className={classes.mute}>&nbsp;({numOfTotalDebondings})</span>
              )}
              {(stats?.numOfItems.numOfPendingDebondings ?? 0) +
                (stats?.numOfItems.numOfAvailableToClaimDebondings ?? 0) >
                0 && (
                <Notification>
                  {(stats?.numOfItems.numOfPendingDebondings ?? 0) +
                    (stats?.numOfItems.numOfAvailableToClaimDebondings ?? 0)}
                </Notification>
              )}
            </p>
          </Tab>
        </Tabs>
        <Panel>
          {stats !== null && (
            <OverviewTab
              totalAmount={
                stats.balances.accountBalance +
                stats.balances.totalPendingStake +
                stats.balances.totalStaked +
                stats.balances.totalPendingDebondings +
                stats.balances.totalDebonding
              }
              availableAmount={stats.balances.accountBalance}
              pendingStakedAmount={stats.balances.totalPendingStake}
              stakedAmount={stats.balances.totalStaked}
              pendingDebondingAmount={stats.balances.totalPendingDebondings}
              debondingAmount={stats.balances.totalDebonding}
            />
          )}
        </Panel>
        <Panel>
          {!!pendingDelegations && !!delegations && (
            <StakedTab pendingDelegations={pendingDelegations} delegations={delegations} />
          )}
        </Panel>
        <Panel>{!!undelegations && <DebondingTab undelegations={undelegations} />}</Panel>
      </div>
      {activeIndex === 0 && (
        <div className={classes.stakeBtnContainer}>
          <Button onClick={navigateToStake}>Stake</Button>
        </div>
      )}
    </>
  )
}

export const StakingTabs = () => (
  <TabsContextProvider>
    <StakingTabsCmp />
  </TabsContextProvider>
)
