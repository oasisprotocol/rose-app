import { FC, useState } from 'react'
import { Card } from '../../components/Card'
import { StakingTabs } from '../../components/StakingTabs'
import { StringUtils } from '../../utils/string.utils'
import classes from './index.module.css'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'
import { useAccount } from 'wagmi'

const DashboardPageCmp: FC = () => {
  const { chain } = useAccount()
  const nativeCurrency = chain?.nativeCurrency
  const tabIndex = useState<number>(0)
  const [activeIndex] = tabIndex

  return (
    <Card header={<h2>Dashboard</h2>}>
      <h3 className={classes.subHeader}>
        {activeIndex === 0 && <>Your balances</>}
        {(activeIndex === 1 || activeIndex === 2) && <>Your active delegations</>}
      </h3>
      <p className={StringUtils.clsx('body', classes.description)}>
        {activeIndex === 0 && <>Overview of your current {nativeCurrency?.symbol} balances.</>}
        {activeIndex === 1 && <>Overview of your currently staked {nativeCurrency?.symbol}.</>}
        {activeIndex === 2 && <>Overview of your {nativeCurrency?.symbol} (being) debonded.</>}
      </p>
      <StakingTabs tabIndex={tabIndex} />
    </Card>
  )
}

export const DashboardPage = withDisconnectedWallet(DashboardPageCmp)
