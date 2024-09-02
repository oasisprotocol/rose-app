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

enum Steps {
  DelegateInputAmount,
  DelegatePreviewTransaction,
  DelegateInProgress,
  DelegateSuccessful,
  DelegateFailed,
  DelegateDoneInProgress,
  DelegateDoneSuccessful,
  DelegateDoneFailed,
}

export const StakingAmountPage: FC = () => {
  const navigate = useNavigate()
  const { address } = useParams<{ address: string }>()
  const { getValidatorByAddress } = useAppState()
  const {
    state: { nativeCurrency },
    delegate,
    delegateDone,
  } = useWeb3()
  const [step, setStep] = useState<Steps>(Steps.DelegateInputAmount)
  const [validator, setValidator] = useState<Validator | null>(null)
  const [amount, setAmount] = useState<bigint>(0n)
  const [error, setError] = useState('')
  const [delegationReceiptId, setDelegationReceiptId] = useState(0n)

  const navigateToStake = () => navigate('/stake')
  const navigateToDashboard = () => navigate('/dashboard')

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

  const handleDelegate = async (value: bigint, to: string) => {
    setError('')

    try {
      const receiptId = await delegate(value, to, () => {
        setStep(Steps.DelegateInProgress)
      })
      setDelegationReceiptId(receiptId)

      setStep(Steps.DelegateSuccessful)
    } catch (e) {
      setError(toErrorString(e as Error))
      setStep(Steps.DelegateFailed)
    }
  }

  const handleDelegateDone = async (receiptId: bigint = delegationReceiptId) => {
    setError('')

    try {
      setStep(Steps.DelegateDoneInProgress)
      await delegateDone(receiptId)
      setStep(Steps.DelegateDoneSuccessful)
    } catch (e) {
      setError(toErrorString(e as Error))
      setStep(Steps.DelegateDoneFailed)
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
            <Button onClick={() => handleDelegate(amount, validator?.entity_address)}>Confirm</Button>
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
          actions={
            <div className={classes.stakingSuccessfulAlertActions}>
              <p className="body">
                To conclude the staking procedure, it is necessary to claim a receipt for the stake you have
                just submitted.
              </p>
              <Button onClick={() => handleDelegateDone()}>Continue</Button>
            </div>
          }
        />
      )}
      {step === Steps.DelegateDoneSuccessful && (
        <Alert
          type="success"
          headerText="Staking successful"
          actions={<Button onClick={navigateToDashboard}>Go to dashboard</Button>}
        />
      )}
      {[Steps.DelegateFailed, Steps.DelegateDoneFailed].includes(step) && (
        <Alert
          type="error"
          headerText="Staking failed"
          actions={
            <div className={classes.stakingFailedActions}>
              <Button
                variant="text"
                onClick={() => {
                  switch (step) {
                    case Steps.DelegateFailed:
                      setStep(Steps.DelegatePreviewTransaction)
                      return
                    case Steps.DelegateDoneFailed:
                      setStep(Steps.DelegateSuccessful)
                      return
                  }
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
      {[Steps.DelegateInProgress, Steps.DelegateDoneInProgress].includes(step) && (
        <Alert
          type="loading"
          headerText={(() => {
            switch (step) {
              case Steps.DelegateInProgress:
                return 'Staking initiated'
              case Steps.DelegateDoneInProgress:
                return 'Claiming staking receipt'
              default:
                return 'In progress...'
            }
          })()}
          actions={<span className="body">Submitting transaction...</span>}
        />
      )}
    </>
  )
}
