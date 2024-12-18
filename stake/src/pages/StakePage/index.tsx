import { FC, useState } from 'react'
import { ArrowLeftIcon, Button, Card, StringUtils } from '@oasisprotocol/rose-app-ui/stake'
import { Validator } from '@oasisprotocol/nexus-api'
import { useNavigate } from 'react-router-dom'
import classes from './index.module.css'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'
import { useAppState } from '../../hooks/useAppState'
import { ValidatorsTable } from '../../components/ValidatorsTable'

const StakePageCmp: FC = () => {
  const navigate = useNavigate()
  const {
    state: { isMobileScreen, isDesktopScreen },
  } = useAppState()
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null)

  const navigateToStakeAmount = (validator: Validator) => navigate(validator.entity_address)
  const navigateToDashboard = () => navigate('/stake/dashboard')

  return (
    <Card
      className={classes.validatorsCard}
      header={<h2>Validators</h2>}
      hasBackButton={isMobileScreen}
      onBackButtonClick={navigateToDashboard}
    >
      <p className={StringUtils.clsx('body', classes.description)}>
        All options will reward users with 2.5% APY. Commission charged on rewards may vary.
      </p>
      <ValidatorsTable value={selectedValidator} onChange={setSelectedValidator} />
      <div className={classes.actionButtonsContainer}>
        <Button disabled={!selectedValidator} onClick={() => navigateToStakeAmount(selectedValidator!)}>
          Confirm validator
        </Button>
        {isDesktopScreen && (
          <Button variant="text" onClick={() => navigateToDashboard()} startSlot={<ArrowLeftIcon />}>
            Back
          </Button>
        )}
      </div>
    </Card>
  )
}

export const StakePage = withDisconnectedWallet(StakePageCmp)
