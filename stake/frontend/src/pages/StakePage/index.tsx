import { FC, useState } from 'react'
import { Card } from '../../components/Card'
import { StringUtils } from '../../utils/string.utils'
import { ValidatorsTable } from '../../components/ValidatorsTable'
import { Validator } from '@oasisprotocol/nexus-api'
import { Button } from '../../components/Button'
import { useNavigate } from 'react-router-dom'
import classes from './index.module.css'
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'
import { useAppState } from '../../hooks/useAppState'

const StakePageCmp: FC = () => {
  const navigate = useNavigate()
  const {
    state: { isMobileScreen, isDesktopScreen },
  } = useAppState()
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null)

  const navigateToStakeAmount = (validator: Validator) => navigate(validator.entity_address)
  const navigateToDashboard = () => navigate('/dashboard')

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
