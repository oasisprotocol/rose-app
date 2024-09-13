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

const StakePageCmp: FC = () => {
  const navigate = useNavigate()
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null)

  const navigateToStakeAmount = (validator: Validator) => navigate(validator.entity_address)
  const navigateToDashboard = () => navigate('/dashboard')

  return (
    <Card header={<h2>Validators</h2>}>
      <p className={StringUtils.clsx('body', classes.description)}>Select a validator below to proceed.</p>
      <ValidatorsTable value={selectedValidator} onChange={setSelectedValidator} />
      <div className={classes.actionButtonsContainer}>
        <Button disabled={!selectedValidator} onClick={() => navigateToStakeAmount(selectedValidator!)}>
          Select validator
        </Button>
        <Button variant="text" onClick={() => navigateToDashboard()} startSlot={<ArrowLeftIcon />}>
          Back
        </Button>
      </div>
    </Card>
  )
}

export const StakePage = withDisconnectedWallet(StakePageCmp)
