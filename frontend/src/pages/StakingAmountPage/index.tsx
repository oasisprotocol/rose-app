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
import { formatUnits, parseUnits } from 'ethers'
import { PreviewTable } from '../../components/PreviewTable'
import { Amount } from '../../components/Amount'
import { FeeAmount } from '../../components/FeeAmount'
import { GasPrice } from '../../components/GasPrice'
import { Alert } from '../../components/Alert'
import { toErrorString } from '../../utils/errors'
import { ArrowLeftIcon } from '../../components/icons/ArrowLeftIcon'
import { Delegations } from '../../types'
import { FormattingUtils } from '../../utils/formatting.utils'
import { CONSENSUS_DECIMALS, GAS_LIMIT_STAKE, MIN_STAKE_AMOUNT } from '../../constants/config'
import BigNumber from 'bignumber.js'
import { NumberUtils } from '../../utils/number.utils'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'

enum Steps {
  DelegateInputAmount,
  DelegatePreviewTransaction,
  DelegateInProgress,
  DelegateSuccessful,
  DelegateFailed,
}

const StakingAmountPageCmp: FC = () => {
  const navigate = useNavigate()
  const { address } = useParams<{ address: string }>()
  const {
    state: { delegations, stats, isMobileScreen, isDesktopScreen },
    getValidatorByAddress,
    fetchDelegations,
    fetchValidators,
  } = useAppState()
  const {
    state: { nativeCurrency },
    delegate,
  } = useWeb3()
  const [step, setStep] = useState<Steps>(Steps.DelegateInputAmount)
  const [validator, setValidator] = useState<Validator | null>(null)
  const [amount, setAmount] = useState<bigint>(0n)
  const [error, setError] = useState('')
  const [amountError, setAmountError] = useState<string | null>(null)

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

  const handleDelegate = async (prevDelegations: Delegations, value: bigint, to: string) => {
    setError('')
    const sapphireAmount = NumberUtils.consensusAmountToSapphireAmount(value)

    try {
      await delegate(sapphireAmount, to, () => {
        setStep(Steps.DelegateInProgress)
      })

      const [delegations] = await Promise.all([fetchDelegations(), fetchValidators()])

      // This should work in 99% of cases!
      const [diff] = delegations.filter(
        d =>
          !prevDelegations.some(prevD => {
            return FormattingUtils.serializeObj(prevD) === FormattingUtils.serializeObj(d)
          })
      )

      if (!diff) {
        throw new Error('Unable to retrieve stake! Navigate to dashboard, and continue from there.')
      }

      setStep(Steps.DelegateSuccessful)
    } catch (e) {
      setError(toErrorString(e as Error))
      setStep(Steps.DelegateFailed)
    }
  }

  const getAmountFromPercentage = (accountBalance => (percentage: number) => {
    if (accountBalance === undefined) {
      return ''
    }

    const balance = BigNumber(stats?.balances.accountBalance?.toString() ?? '0').div(10 ** CONSENSUS_DECIMALS)

    const parsedAmount = BigInt(
      BigNumber(balance).multipliedBy(percentage).integerValue(BigNumber.ROUND_DOWN).toString(10)
    )

    return formatUnits(parsedAmount, CONSENSUS_DECIMALS)
  })(stats?.balances.accountBalance)

  const handleAmountInputChange = ({ value }: { value?: string }) => {
    setAmountError('')

    let parsedAmount = -1n
    const accountBalance = BigNumber(stats?.balances.accountBalance?.toString() ?? '0').div(
      10 ** CONSENSUS_DECIMALS
    )

    if (value) {
      try {
        parsedAmount = value ? parseUnits(value.toString(), CONSENSUS_DECIMALS) : -1n
      } catch (ex) {
        console.warn('Unable to parse', value.toString())
        setAmountError(
          'The field contains an invalid value. The accepted format includes a decimal, with a maximum of nine decimal places.'
        )

        return
      }
    }

    if (parsedAmount !== -1n) {
      setAmount(parsedAmount)
    }

    if (parsedAmount < MIN_STAKE_AMOUNT) {
      setAmountError(`The minimum amount to stake is 100 ${nativeCurrency?.symbol}`)
    } else if (accountBalance.gt(0) && accountBalance.lt(parsedAmount.toString())) {
      setAmountError('Your account balance is too low.')
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
            <span className={StringUtils.clsx('mono', classes.validatorName)}>
              {StringUtils.getValidatorFriendlyName(validator)}
            </span>
            .
            <br />
            There is a minimum of 100 {nativeCurrency?.symbol} stake amount.
          </p>
          <AmountInput
            className={classes.amountInput}
            label="Amount"
            error={amountError ?? ''}
            onChange={handleAmountInputChange}
            calcAmountFromPercentage={getAmountFromPercentage}
          />
          {!validator.active && (
            <p className={StringUtils.clsx('body', classes.inactiveAmountInputWarning)}>
              <b>Please note:</b> You have selected an inactive validator which means you do not receive
              commission over your staked amount.
            </p>
          )}
          <div className={classes.actionButtonsContainer}>
            <Button disabled={amountError !== ''} onClick={() => setStep(Steps.DelegatePreviewTransaction)}>
              Delegate
            </Button>
            {isDesktopScreen && (
              <Button variant="text" onClick={() => navigateToStake()} startSlot={<ArrowLeftIcon />}>
                Back
              </Button>
            )}
          </div>
        </Card>
      )}
      {step === Steps.DelegatePreviewTransaction && (
        <Card className={classes.previewTxCard} header={<h2>Preview</h2>}>
          <p className={StringUtils.clsx('body', classes.description)}>
            Check the details of the transaction below.
          </p>
          <PreviewTable
            className={classes.delegatePreviewTransactionTable}
            content={[
              [
                <p className="body">Amount:</p>,
                <p className="body">
                  <Amount amount={amount} unit="consensus" />
                </p>,
              ],
              [
                <p className="body">Validator:</p>,
                <p className="body mono">
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
                  <FeeAmount gasLimit={GAS_LIMIT_STAKE} />
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
            {isDesktopScreen && (
              <Button
                variant="text"
                onClick={() => setStep(Steps.DelegateInputAmount)}
                startSlot={<ArrowLeftIcon />}
              >
                Back
              </Button>
            )}
          </div>
        </Card>
      )}
      {step === Steps.DelegateSuccessful && (
        <Alert
          type="success"
          headerText="Staking successful"
          actions={
            <Button onClick={navigateToDashboard}>
              {isMobileScreen && <>Continue</>}
              {isDesktopScreen && <>Go to dashboard</>}
            </Button>
          }
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

export const StakingAmountPage = withDisconnectedWallet(StakingAmountPageCmp)
