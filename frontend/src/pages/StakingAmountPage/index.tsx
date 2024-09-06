import { FC, useEffect, useState } from 'react'
import { Card } from '../../components/Card'
import { StringUtils } from '../../utils/string.utils'
import { Validator } from '@oasisprotocol/nexus-api'
import { Button } from '../../components/Button'
import { useNavigate, useParams } from 'react-router-dom'
import classes from './index.module.css'
import { useAppState } from '../../hooks/useAppState'
import { AmountInput } from '../../components/AmountInput'
import { useWeb3 } from '../../hooks/useWeb3'
import { parseUnits } from 'ethers'
import { PreviewTable } from '../../components/PreviewTable'
import { Amount } from '../../components/Amount'
import { FeeAmount } from '../../components/FeeAmount'
import { GasPrice } from '../../components/GasPrice'
import { Alert } from '../../components/Alert'
import { toErrorString } from '../../utils/errors'
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon'
import { Delegations } from '../../types'

enum Steps {
  DelegateInputAmount,
  DelegatePreviewTransaction,
  DelegateInProgress,
  DelegateSuccessful,
  DelegateFailed,
}

export const StakingAmountPage: FC = () => {
  const navigate = useNavigate()
  const { address } = useParams<{ address: string }>()
  const {
    state: { delegations },
    getValidatorByAddress,
    fetchDelegations,
  } = useAppState()
  const {
    state: { nativeCurrency },
    delegate,
  } = useWeb3()
  const [step, setStep] = useState<Steps>(Steps.DelegateInputAmount)
  const [validator, setValidator] = useState<Validator | null>(null)
  const [amount, setAmount] = useState<bigint>(0n)
  const [error, setError] = useState('')

  const navigateToStake = () => navigate('/stake')

  useEffect(() => {
    if (!address) {
      throw new Error("Validator address can't be empty!")
    }

    const init = async () => {
      const _validator = await getValidatorByAddress({ address })

      if (!_validator) {
        console.warn(`Validator with address "${address}" not found!`)
      } else {
        setValidator(_validator)
      }
    }

    init()
  }, [getValidatorByAddress, address])

  const handleDelegate = async (prevDelegations: Delegations, value: bigint, to: string) => {
    setError('')

    try {
      await delegate(value, to, () => {
        setStep(Steps.DelegateInProgress)
      })

      const delegations = await fetchDelegations()

      // This should work in 99% of cases!
      const [diff] = delegations.filter(d => !prevDelegations.includes(d))

      if (!diff) {
        throw new Error('Unable to retrieve stake! Navigate to dashboard, and continue from there.')
      }

      setStep(Steps.DelegateSuccessful)
    } catch (e) {
      setError(toErrorString(e as Error))
      setStep(Steps.DelegateFailed)
    }
  }

  if (!validator) {
    return <Alert type="loading" />
  }

  return (
    <>
      {step === Steps.DelegateInputAmount && (
        <Card header={<h2>Staking amount</h2>}>
          <p className={StringUtils.clsx('body', classes.description)}>
            Enter the amount you want to stake with{' '}
            <span className={classes.validatorName}>{StringUtils.getValidatorFriendlyName(validator)}</span>.
            <br />
            There is a minimum of 100 ROSE.
          </p>
          <AmountInput
            label="Amount"
            value={amount}
            onChange={({ value }) => {
              setAmount(value ? parseUnits(value.toString(), nativeCurrency?.decimals) : 0n)
            }}
            decimals={nativeCurrency?.decimals}
          />
          <div className={classes.actionButtonsContainer}>
            <Button onClick={() => setStep(Steps.DelegatePreviewTransaction)}>Delegate</Button>
            <Button variant="text" onClick={() => navigateToStake()} startSlot={<ArrowLeftIcon />}>
              Back
            </Button>
          </div>
        </Card>
      )}
      {step === Steps.DelegatePreviewTransaction && (
        <Card header={<h2>Preview</h2>}>
          <p className={StringUtils.clsx('body', classes.description)}>
            Check the details of the transaction below.
          </p>
          <PreviewTable
            className={classes.delegatePreviewTransactionTable}
            content={[
              [
                <p className="body">Amount:</p>,
                <p className="body">
                  <Amount amount={amount} />
                </p>,
              ],
              [
                <p className="body">Validator:</p>,
                <p className="body">
                  {(() => {
                    const validatorName = StringUtils.getValidatorName(validator)

                    if (!validatorName) return null

                    return (
                      <>
                        {validatorName}
                        <br />
                      </>
                    )
                  })()}
                  {StringUtils.getValidatorFriendlyAddress(validator)}
                </p>,
              ],
              [
                <p className="body">Max fee:</p>,
                <p className="body">
                  <FeeAmount />
                </p>,
              ],
              [
                <span className="body">Gas price:</span>,
                <span className="body">
                  <GasPrice />
                </span>,
              ],
            ]}
          />
          <div className={classes.actionButtonsContainer}>
            <Button onClick={() => handleDelegate(delegations!, amount, validator?.entity_address)}>
              Confirm
            </Button>
            <Button
              variant="text"
              onClick={() => setStep(prevValue => prevValue - 1)}
              startSlot={<ArrowLeftIcon />}
            >
              Back
            </Button>
          </div>
        </Card>
      )}
      {step === Steps.DelegateSuccessful && (
        <Alert
          type="success"
          headerText="Staking successful"
          actions={<Button onClick={() => {}}>Continue</Button>}
        />
      )}
      {step === Steps.DelegateFailed && (
        <Alert
          type="error"
          headerText="Staking failed"
          actions={
            <div className={classes.stakingFailedActions}>
              <Button
                variant="text"
                onClick={() => {
                  setStep(Steps.DelegatePreviewTransaction)
                }}
                startSlot={<ArrowLeftIcon />}
              >
                Back
              </Button>
            </div>
          }
        >
          {StringUtils.truncate(error)}
        </Alert>
      )}
      {step === Steps.DelegateInProgress && (
        <Alert
          type="loading"
          headerText="Staking in progress..."
          actions={<span className="body">Submitting transaction...</span>}
        />
      )}
    </>
  )
}
