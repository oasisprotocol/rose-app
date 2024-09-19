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
import classes from './index.module.css'
import { TabsContext } from '../Tabs/TabsContext'
import { Button } from '../Button'
import { useNavigate } from 'react-router-dom'
import { NumberUtils } from '../../utils/number.utils'
import { LoadingTableData } from '../LoadingTableData'

export const StakingTabsCmp: FC = () => {
  const navigate = useNavigate()
  const {
    state: { stats, delegations, undelegations },
  } = useAppState()
  const [activeIndex] = useContext(TabsContext)

  const numOfTotalStakes = NumberUtils.orZeroNumber(stats?.numOfItems.numOfStakes)
  const numOfTotalDebondings = NumberUtils.orZeroNumber(stats?.numOfItems.numOfDebondings)

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
            </p>
          </Tab>
          <Tab>
            <p className="body">
              Debonding
              {numOfTotalDebondings > 0 && (
                <span className={classes.mute}>&nbsp;({numOfTotalDebondings})</span>
              )}
            </p>
          </Tab>
        </Tabs>
        <Panel>
          {stats !== null && (
            <OverviewTab
              totalAmount={
                NumberUtils.orZeroBigInt(stats.balances.accountBalance) +
                NumberUtils.orZeroBigInt(stats.balances.totalStaked) +
                NumberUtils.orZeroBigInt(stats.balances.totalDebonding)
              }
              availableAmount={NumberUtils.orZeroBigInt(stats.balances.accountBalance)}
              stakedAmount={NumberUtils.orZeroBigInt(stats.balances.totalStaked)}
              debondingAmount={NumberUtils.orZeroBigInt(stats.balances.totalDebonding)}
            />
          )}
        </Panel>
        <Panel>{delegations ? <StakedTab delegations={delegations} /> : <LoadingTableData />}</Panel>
        <Panel>{undelegations ? <DebondingTab undelegations={undelegations} /> : <LoadingTableData />}</Panel>
      </div>
      {activeIndex === 0 && (
        <div className={classes.stakeBtnContainer}>
          <Button onClick={navigateToStake}>Stake</Button>
        </div>
      )}
    </>
  )
}

interface Props {
  tabIndex: [number, (state: number) => void]
}

export const StakingTabs: FC<Props> = ({ tabIndex }) => (
  <TabsContextProvider state={tabIndex}>
    <StakingTabsCmp />
  </TabsContextProvider>
)
