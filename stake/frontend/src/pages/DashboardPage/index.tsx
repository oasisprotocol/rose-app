import { FC, useEffect, useState } from 'react'
import { useWeb3 } from '../../hooks/useWeb3'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/Card'
import { StakingTabs } from '../../components/StakingTabs'
import { StringUtils } from '../../utils/string.utils'
import classes from './index.module.css'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'

const DashboardPageCmp: FC = () => {
  const navigate = useNavigate()
  const {
    state: { isConnected, nativeCurrency },
  } = useWeb3()
  const tabIndex = useState<number>(0)
  const [activeIndex] = tabIndex

  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])

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
