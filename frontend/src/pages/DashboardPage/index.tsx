import { FC, useEffect } from 'react'
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

  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])

  return (
    <Card header={<h2>Dashboard</h2>}>
      <h3 className={classes.subHeader}>Your balances</h3>
      <p className={StringUtils.clsx('body', classes.description)}>
        Overview of your current {nativeCurrency?.symbol} balances.
      </p>
      <StakingTabs />
    </Card>
  )
}

export const DashboardPage = withDisconnectedWallet(DashboardPageCmp)
