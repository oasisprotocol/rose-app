import { FC, useEffect, useRef, useState } from 'react'
import {
  Alert,
  AmountInput,
  amountPattern,
  ArrowLeftIcon,
  Button,
  Card,
  FeeAmount,
  GasPrice,
  InfoIcon,
  PreviewTable,
  SharesAmount,
  StringUtils,
  toErrorString,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@oasisprotocol/rose-app-ui/stake'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppState } from '../../hooks/useAppState'
import classes from './index.module.css'
import { Validator } from '@oasisprotocol/nexus-api'
import BigNumber from 'bignumber.js'
import { CONSENSUS_DECIMALS, GAS_LIMIT_UNSTAKE } from '../../constants/config'
import { useWeb3 } from '../../hooks/useWeb3'
import { Delegation, Undelegations } from '../../types'
import { FormattingUtils } from '../../utils/formatting.utils'
import { withDisconnectedWallet } from '../../hoc/withDisconnectedWallet'
import { useAccount, useSendTransaction } from 'wagmi'
import { formatUnits } from 'viem'
import { EpochTimeEstimate } from '../../components/EpochTimeEstimate'

enum Steps {
  UndelegateInputAmount,
  UndelegatePreviewTransaction,
  UndelegateInProgress,
  UndelegateSuccessful,
  UndelegateFailed,
}

const UnstakePageCmp: FC = () => {
  const { address } = useParams<{ address: string }>()
  const navigate = useNavigate()
  const {
    state: { delegations, undelegations, isMobileScreen, isDesktopScreen },
    getValidatorByAddress,
    fetchDelegations,
    fetchUndelegations,
    fetchValidators,
  } = useAppState()
  const { populateUndelegateTx, getTransactionReceipt } = useWeb3()
  const { chain } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const nativeCurrency = chain?.nativeCurrency
  const [step, setStep] = useState<Steps>(Steps.UndelegateInputAmount)
  const [validator, setValidator] = useState<Validator | null>(null)
  const [sharePerRoseRatio, setSharePerRoseRatio] = useState<BigNumber>(BigNumber(0))
  const [rosePerShareRatio, setRosePerShareRatio] = useState<BigNumber>(BigNumber(0))
  const [shares, setShares] = useState<BigNumber>(BigNumber(0))
  const [error, setError] = useState('')
  const [undelegationEpoch, setUndelegationEpoch] = useState(0n)
  const [amountError, setAmountError] = useState<string | null>(null)
  const delegation = useRef<Delegation | null | undefined>()

  const navigateToDashboard = () => navigate('/stake/dashboard')

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

    const foundDelegation = delegations.find(({ to }) => to === address)

    if (!foundDelegation) {
      delegation.current = null
      return
    }

    delegation.current = {
      ...foundDelegation,
    }
  }, [address, delegations])

  const handleUndelegate = async (
    prevUndelegations: Undelegations,
    gasPrice: bigint | undefined,
    amountShares: bigint = BigInt(
      BigNumber.min(
        shares.integerValue(BigNumber.ROUND_CEIL),
        delegation.current?.shares.toString() ?? '0'
      ).toFixed(0)
    ),
    to = delegation.current!.to
  ) => {
    setError('')
    setStep(Steps.UndelegateInProgress)

    sendTransactionAsync(await populateUndelegateTx(amountShares, to, gasPrice!), {
      onSuccess: async hash => {
        await getTransactionReceipt(hash)

        const [undelegations] = await Promise.all([
          fetchUndelegations(),
          fetchDelegations(),
          fetchValidators(),
        ])

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
      },
      onError: e => {
        setError(toErrorString(e as Error))
        setStep(Steps.UndelegateFailed)
      },
    })
  }

  const getAmountFromPercentage = (delegationShares => (percentage: number) => {
    if (delegationShares === undefined) {
      return ''
    }

    const _shares = delegationShares.multipliedBy(percentage)

    const amount = BigNumber(_shares.toFixed(0) ?? 0)
      .multipliedBy(rosePerShareRatio)
      .integerValue(BigNumber.ROUND_DOWN)

    return formatUnits(BigInt(amount.toFixed(0)), CONSENSUS_DECIMALS)
  })(BigNumber(delegation.current?.shares.toString() ?? 0))

  const handleAmountInputChange = ({ value, percentage }: { value?: string; percentage?: number }) => {
    setAmountError('')
    let shares = BigNumber(0)
    const delegationShares = BigNumber(delegation.current?.shares.toString() ?? 0)

    if (!percentage && !new RegExp(amountPattern).test(value!)) {
      setAmountError(
        'The field contains an invalid value. The accepted format includes a decimal, with a maximum of nine decimal places.'
      )

      return
    }

    if (value) {
      shares = BigNumber(value.toString())
        .multipliedBy(10 ** CONSENSUS_DECIMALS)
        .multipliedBy(sharePerRoseRatio)
    }

    setShares(shares)

    if (shares.lte(0)) {
      setAmountError('Amount is required!')
    } else if (shares.gt(delegationShares)) {
      const maxAmount = delegationShares.multipliedBy(rosePerShareRatio).integerValue(BigNumber.ROUND_DOWN)

      setAmountError(
        `Maximum amount you can unstake is ${formatUnits(BigInt(maxAmount.toFixed(0)), CONSENSUS_DECIMALS)} ${nativeCurrency?.symbol} !`
      )
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
        <Card
          header={<h2>Unstaking amount</h2>}
          hasBackButton={isMobileScreen}
          onBackButtonClick={navigateToDashboard}
        >
          <p className={StringUtils.clsx('body', classes.description)}>
            Enter the amount of {nativeCurrency?.symbol} you wish to unstake from{' '}
            <span className={StringUtils.clsx('mono', classes.validatorName)}>
              {StringUtils.getValidatorFriendlyName(validator)}
            </span>
            .
          </p>
          <AmountInput
            className={classes.amountInput}
            error={amountError ?? ''}
            label="Amount"
            onChange={handleAmountInputChange}
            calcAmountFromPercentage={getAmountFromPercentage}
          />
          <p className="body mute">
            <b>Note:</b> users will be able to claim their staked ROSE after the 14 day debonding period has
            finished.
          </p>
          <div className={classes.actionButtonsContainer}>
            <Button disabled={amountError !== ''} onClick={() => setStep(Steps.UndelegatePreviewTransaction)}>
              Unstake
            </Button>
            {isDesktopScreen && (
              <Button variant="text" onClick={() => navigateToDashboard()} startSlot={<ArrowLeftIcon />}>
                Back
              </Button>
            )}
          </div>
        </Card>
      )}
      {step === Steps.UndelegatePreviewTransaction && (
        <Card
          className={classes.previewTxCard}
          header={<h2>Preview</h2>}
          hasBackButton={isMobileScreen}
          onBackButtonClick={() => {
            setStep(Steps.UndelegateInputAmount)
          }}
        >
          <p className={StringUtils.clsx('body', classes.description)}>
            Check the details of the transaction below.
          </p>
          <GasPrice>
            {gasPrice => (
              <>
                <PreviewTable
                  className={classes.undelegatePreviewTransactionTable}
                  content={[
                    [
                      <p className="body">Amount:</p>,
                      <p className="body">
                        <SharesAmount shares={shares} validator={validator} type="staking" />
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
                        {!validator.active && <p className="body mute">(inactive)</p>}
                      </p>,
                    ],
                    [
                      <p className="body">Max fee:</p>,
                      <p className="body">
                        <FeeAmount gasPrice={gasPrice} gasLimit={GAS_LIMIT_UNSTAKE} />
                      </p>,
                    ],
                    [
                      <span className="body">
                        Gas price:&nbsp;
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon />
                          </TooltipTrigger>
                          <TooltipContent>
                            Cost per unit of gas spent for the transaction in n{nativeCurrency?.symbol}.
                          </TooltipContent>
                        </Tooltip>
                      </span>,
                      <span className="body">
                        <GasPrice gasPrice={gasPrice} />
                      </span>,
                    ],
                  ]}
                />
                <div className={classes.actionButtonsContainer}>
                  <Button onClick={() => handleUndelegate(undelegations!, gasPrice)}>Confirm</Button>
                  {isDesktopScreen && (
                    <Button
                      variant="text"
                      onClick={() => setStep(Steps.UndelegateInputAmount)}
                      startSlot={<ArrowLeftIcon />}
                    >
                      Back
                    </Button>
                  )}
                </div>
              </>
            )}
          </GasPrice>
        </Card>
      )}
      {step === Steps.UndelegateSuccessful && (
        <Alert
          type="success"
          headerText="Unstaking successful"
          actions={
            <div className={classes.undelegateStartSuccessfulAlertActions}>
              <p className="body">
                Your {nativeCurrency?.symbol} will be available {isMobileScreen && <br />} in{' '}
                <EpochTimeEstimate epoch={undelegationEpoch} distance /> (on{' '}
                <EpochTimeEstimate epoch={undelegationEpoch} />
                ).
              </p>
              <Button onClick={navigateToDashboard}>
                {isMobileScreen && <>Continue</>}
                {isDesktopScreen && <>Go to dashboard</>}
              </Button>
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
          headerText="Unstaking initiated"
          actions={
            <span className="body">You can see your debonding positions from the Stake dashboard.</span>
          }
        />
      )}
    </>
  )
}

export const UnstakePage = withDisconnectedWallet(UnstakePageCmp)
