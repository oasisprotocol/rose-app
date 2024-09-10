import { FC, useEffect, useRef, useState } from 'react'
import { Card } from '../../components/Card'
import { StringUtils } from '../../utils/string.utils'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import classes from './index.module.css'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { AmountInput } from '../../components/AmountInput'
import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { CONSENSUS_DECIMALS, GAS_LIMIT_UNSTAKE } from '../../constants/config'
import { PreviewTable } from '../../components/PreviewTable'
import { FeeAmount } from '../../components/FeeAmount'
import { GasPrice } from '../../components/GasPrice'
import { useWeb3 } from '../../hooks/useWeb3'
import { toErrorString } from '../../utils/errors'
import { EpochTimeEstimate } from '../../components/EpochTimeEstimate'
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon'
import { SharesAmount } from '../../components/SharesAmount'
import { Delegation, Undelegations } from '../../types'
import { FormattingUtils } from '../../utils/formatting.utils'

enum Steps {
  UndelegateInputAmount,
  UndelegatePreviewTransaction,
  UndelegateInProgress,
  UndelegateSuccessful,
  UndelegateFailed,
}

export const UnstakePage: FC = () => {
  const { address } = useParams<{ address: string }>()
  const navigate = useNavigate()
  const {
    state: { delegations, undelegations },
    getValidatorByAddress,
    fetchDelegations,
    fetchUndelegations,
  } = useAppState()
  const { undelegate } = useWeb3()
  const [step, setStep] = useState<Steps>(Steps.UndelegateInputAmount)
  const [validator, setValidator] = useState<Validator | null>(null)
  const [sharePerRoseRatio, setSharePerRoseRatio] = useState<BigNumber>(BigNumber(0))
  const [rosePerShareRatio, setRosePerShareRatio] = useState<BigNumber>(BigNumber(0))
  const [shares, setShares] = useState<BigNumber>(BigNumber(0))
  const [error, setError] = useState('')
  const [undelegationEpoch, setUndelegationEpoch] = useState(0n)
  const delegation = useRef<Delegation | null | undefined>()

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

        setSharePerRoseRatio(
          BigNumber(_validator.escrow.active_shares ?? 0).div(
            BigNumber(_validator.escrow.active_balance ?? 0)
          )
        )
        setRosePerShareRatio(
          BigNumber(_validator.escrow.active_balance ?? 0).div(
            BigNumber(_validator.escrow.active_shares ?? 0)
          )
        )
      }
    }

    init()
  }, [getValidatorByAddress, address])

  useEffect(() => {
    if (delegation.current || !delegations) {
      return
    }

    const foundDelagation = delegations.find(({ to }) => to === address)

    if (!foundDelagation) {
      delegation.current = null
      return
    }

    delegation.current = {
      ...foundDelagation,
    }
  }, [address, delegations])

  const handleUndelegate = async (
    prevUndelegations: Undelegations,
    amountShares: bigint = BigInt(shares.integerValue(BigNumber.ROUND_DOWN).toString()),
    to = delegation.current!.to
  ) => {
    setError('')

    try {
      await undelegate(amountShares, to, () => {
        setStep(Steps.UndelegateInProgress)
      })

      const [undelegations] = await Promise.all([fetchUndelegations(), fetchDelegations()])

      // This should work in 99% of cases!
      const [diff] = undelegations.filter(
        und =>
          !prevUndelegations.some(prevUnd => {
            return FormattingUtils.serializeObj(prevUnd) === FormattingUtils.serializeObj(und)
          })
      )

      if (!diff) {
        throw new Error('Unable to retrieve unstake! Navigate to dashboard, and continue from there.')
      }

      setUndelegationEpoch(diff.epoch)

      setStep(Steps.UndelegateSuccessful)
    } catch (e) {
      setError(toErrorString(e as Error))
      setStep(Steps.UndelegateFailed)
    }
  }

  if (delegation === undefined) {
    return <Alert type="loading" />
  }

  if (delegation === null) {
    return (
      <Alert
        type="error"
        headerText="Unable to find delegation"
        actions={
          <div className={classes.alertActions}>
            <Button variant="text" onClick={() => navigateToDashboard()} startSlot={<ArrowLeftIcon />}>
              Back
            </Button>
          </div>
        }
      />
    )
  }

  if (!validator) {
    return <Alert type="loading" />
  }

  return (
    <>
      {step === Steps.UndelegateInputAmount && (
        <Card header={<h2>Unstaking amount</h2>}>
          <p className={StringUtils.clsx('body', classes.description)}>
            Enter the amount you want to unstake from{' '}
            <span className={classes.validatorName}>{StringUtils.getValidatorFriendlyName(validator)}</span>.
          </p>
          <AmountInput
            label="Amount"
            value={BigNumber(shares.toString() ?? 0)
              .multipliedBy(rosePerShareRatio)
              .integerValue(BigNumber.ROUND_DOWN)}
            onChange={({ value, percentage }) => {
              if (value) {
                setShares(
                  BigNumber(value.toString())
                    .multipliedBy(10 ** CONSENSUS_DECIMALS)
                    .multipliedBy(sharePerRoseRatio)
                )
              } else if (percentage) {
                setShares(BigNumber(delegation.current?.shares.toString() ?? 0).multipliedBy(percentage))
              } else {
                setShares(BigNumber(0))
              }
            }}
            decimals={CONSENSUS_DECIMALS}
          />
          <div className={classes.actionButtonsContainer}>
            <Button onClick={() => setStep(Steps.UndelegatePreviewTransaction)}>Unstake</Button>
            <Button variant="text" onClick={() => navigateToDashboard()} startSlot={<ArrowLeftIcon />}>
              Back
            </Button>
          </div>
        </Card>
      )}
      {step === Steps.UndelegatePreviewTransaction && (
        <Card header={<h2>Preview</h2>}>
          <p className={StringUtils.clsx('body', classes.description)}>
            Check the details of the transaction below.
          </p>
          <PreviewTable
            className={classes.undelegatePreviewTransactionTable}
            content={[
              [
                <p className="body">Amount:</p>,
                <p className="body">
                  <SharesAmount shares={shares} validator={validator} />
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
                  <FeeAmount gasLimit={GAS_LIMIT_UNSTAKE} />
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
            <Button onClick={() => handleUndelegate(undelegations!)}>Confirm</Button>
            <Button
              variant="text"
              onClick={() => setStep(Steps.UndelegateInputAmount)}
              startSlot={<ArrowLeftIcon />}
            >
              Back
            </Button>
          </div>
        </Card>
      )}
      {step === Steps.UndelegateSuccessful && (
        <Alert
          type="success"
          headerText="Unstaking successful"
          actions={
            <div className={classes.undelegateStartSuccessfulAlertActions}>
              <p className="body">
                The debonding process has successfully started. <br />
                Your funds will be available in <EpochTimeEstimate
                  epoch={undelegationEpoch}
                  distance
                /> (on <EpochTimeEstimate epoch={undelegationEpoch} />
                ).
              </p>
              <Button onClick={navigateToDashboard}>Go to dashboard</Button>
            </div>
          }
        />
      )}
      {step === Steps.UndelegateFailed && (
        <Alert
          type="error"
          headerText="Unstaking failed"
          actions={
            <div className={classes.alertActions}>
              <Button
                variant="text"
                onClick={() => {
                  setStep(Steps.UndelegatePreviewTransaction)
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
      {step === Steps.UndelegateInProgress && (
        <Alert
          type="loading"
          headerText="Unstaking in progress..."
          actions={<span className="body">Submitting transaction...</span>}
        />
      )}
    </>
  )
}
