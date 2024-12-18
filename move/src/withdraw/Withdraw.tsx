import photo_camera_outlined_svg from '@material-design-icons/svg/outlined/photo_camera.svg'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FormEvent, useState } from 'react'
import { parseUnits } from 'viem'
import loader_blocks_svg from '/move/loader_blocks.svg?url'
import logo_rose_move_svg from '/move/logo_rose_move.svg?url'
import symbol_check_circle_svg from '/move/symbol_check_circle.svg?url'
import symbol_warning_svg from '/move/symbol_warning.svg?url'
import classes from '../App.module.css'
import {
  Input,
  MoveAmount as Amount,
  MoveButton as Button,
  ProgressBar,
  ShortAddress,
  VideoModal,
} from '@oasisprotocol/rose-app-ui/move'
import { AccountAvatar } from '@oasisprotocol/rose-app-ui/core'
import { Layout } from '../components/Layout'
import { useWithdraw } from '../useWithdraw'
import { getValidOasisAddress } from '../utils/getBalances.ts'
import { amountPattern, consensusConfig, withdrawEstimatedFee } from '../utils/oasisConfig.ts'
import { ExistingBalance } from './ExistingBalance.tsx'

interface FormItem<T = string> {
  value: T | undefined
  error: string | undefined
}

interface DestinationForm {
  destinationConsensusAddress: FormItem<`oasis1${string}`>
  amount: FormItem<bigint>
  error: string | undefined
  isDirty: boolean
}

const destinationFormInitialValue: DestinationForm = {
  destinationConsensusAddress: {
    value: undefined,
    error: 'Wallet address is required!',
  },
  amount: { value: undefined, error: 'Amount is required!' },
  error: undefined,
  isDirty: false,
}

export function Withdraw(props: { withdraw: ReturnType<typeof useWithdraw> }) {
  const {
    generatedSapphireAccount,
    generatedConsensusAccount,
    consensusAddress,
    setConsensusAddress,
    step3,
    step4,
    transferMore,
    availableBalance,
    progress,
    isBlockingNavigatingAway,
    isInputMode,
    setIsInputMode,
    isPrevError,
  } = props.withdraw // Parent useWithdraw

  const isError = progress.percentage === undefined

  const [destinationForm, setDestinationForm] = useState<DestinationForm>({
    ...destinationFormInitialValue,
  })
  const [isWithdrawHelpVideoOpen, setIsWithdrawHelpVideoOpen] = useState(false)

  const handleDestinationFormAddressChange = (value?: string) => {
    if (!value) {
      setDestinationForm(prevState => ({
        ...prevState,
        destinationConsensusAddress: {
          ...prevState.destinationConsensusAddress,
          error: 'Wallet address is required!',
        },
      }))

      return
    }

    const address = getValidOasisAddress(value)

    if (!address) {
      setDestinationForm(prevState => ({
        ...prevState,
        destinationConsensusAddress: {
          ...prevState.destinationConsensusAddress,
          error: 'Invalid oasis1 address!',
        },
      }))

      return
    }

    setDestinationForm(prevState => ({
      ...prevState,
      destinationConsensusAddress: {
        value: address,
        error: undefined,
      },
    }))
  }
  const handleDestinationFormAmountChange = (value?: string) => {
    if (!value) {
      setDestinationForm(prevState => ({
        ...prevState,
        amount: {
          value: 0n,
          error: 'Amount is required!',
        },
      }))

      return
    }

    const _value = value.replace(',', '.')

    if (!_value.match(amountPattern)) {
      setDestinationForm(prevState => ({
        ...prevState,
        amount: {
          ...prevState.amount,
          error: 'Amount is invalid! Should be in x.xxxxxxxxx format',
        },
      }))

      return
    }

    try {
      const amount = parseUnits(_value, consensusConfig.decimals)

      if (amount * 10n ** 9n < withdrawEstimatedFee) {
        setDestinationForm(prevState => ({
          ...prevState,
          amount: {
            ...prevState.amount,
            error: 'Amount is too low!',
          },
        }))

        return
      }

      if (amount * 10n ** 9n > (availableBalance?.value ?? 0n)) {
        setDestinationForm(prevState => ({
          ...prevState,
          amount: {
            ...prevState.amount,
            error: 'There is not enough available balance!',
          },
        }))

        return
      }

      setDestinationForm(prevState => ({
        ...prevState,
        amount: {
          value: amount,
          error: undefined,
        },
      }))
    } catch (ex) {
      setDestinationForm(prevState => ({
        ...prevState,
        amount: {
          ...prevState.amount,
          error: 'Invalid amount!',
        },
      }))
    }
  }

  const handleDestinationFormSubmit = async (
    e: FormEvent,
    opts: {
      hasPreviousBalance: boolean
    } = { hasPreviousBalance: false }
  ) => {
    const { hasPreviousBalance } = opts
    e.preventDefault()

    setDestinationForm(prevState => ({ ...prevState, isDirty: true }))

    const { destinationConsensusAddress, amount } = destinationForm

    if (!destinationConsensusAddress.value || destinationConsensusAddress.error) {
      return
    }

    if (!hasPreviousBalance) {
      if (!amount.value || amount.error) {
        return
      }
      try {
        await step3(amount.value * 10n ** 9n)
      } catch (err) {
        setDestinationForm(prevState => ({ ...prevState, error: (err as Error).message }))
        return
      }
    }

    setIsInputMode(false)
    setConsensusAddress(destinationConsensusAddress.value)
    step4(destinationConsensusAddress.value)

    setDestinationForm({ ...destinationFormInitialValue })
  }

  if (!generatedConsensusAccount) throw new Error('<Withdraw> used before SIWE')
  if (!generatedSapphireAccount) throw new Error('<Withdraw> used before SIWE')
  if (isInputMode) {
    return (
      <Layout
        header={
          <>
            <img src={logo_rose_move_svg} alt="ROSE Move logo" />
            <div className={classes.headerAccount}>
              <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
            </div>
          </>
        }
      >
        <ExistingBalance
          consensusAddress={generatedConsensusAccount.address}
          sapphireAddress={generatedSapphireAccount.address}
        >
          {(hasPreviousBalance, previousAmount) => (
            <div className={classes.withdrawStep1}>
              <div>
                <h1>Where do you want to move your ROSE to?</h1>
                <p className="body">
                  Please enter the crypto exchange deposit address or consensus account address
                  {!hasPreviousBalance && ' and the amount of ROSE you want to move'}.
                </p>
                <button
                  type="button"
                  className={classes.linkButton}
                  onClick={() => setIsWithdrawHelpVideoOpen(true)}
                >
                  Need help? Click here
                  <img
                    src={photo_camera_outlined_svg}
                    alt="Help"
                    width="16"
                    style={{ filter: 'invert(1)' }}
                  />
                </button>
              </div>
              <form onSubmit={e => handleDestinationFormSubmit(e, { hasPreviousBalance })} noValidate>
                <Input
                  className={classes.withdrawStep1Address}
                  onChange={handleDestinationFormAddressChange}
                  label="Wallet address"
                  inputMode="text"
                  error={
                    destinationForm.isDirty ? destinationForm.destinationConsensusAddress.error : undefined
                  }
                  initialValue={consensusAddress}
                />
                {!hasPreviousBalance && (
                  <Input
                    onChange={handleDestinationFormAmountChange}
                    label="Amount"
                    inputMode="decimal"
                    pattern={amountPattern}
                    error={destinationForm.isDirty ? destinationForm.amount.error : undefined}
                  />
                )}

                {!hasPreviousBalance && availableBalance && (
                  <div className={classes.withdrawStep1Breakdown}>
                    <div>
                      <p>Available</p>
                      <p>
                        <Amount value={availableBalance.value} />
                      </p>
                    </div>
                    <div>
                      <p>Fee</p>
                      <p>
                        <Amount value={withdrawEstimatedFee} />
                      </p>
                    </div>
                    <div>
                      <p>
                        <b>Withdrawal amount</b>
                      </p>
                      <p>
                        {!destinationForm.amount.error && destinationForm.amount.value ? (
                          <Amount value={destinationForm.amount.value * 10n ** 9n - withdrawEstimatedFee} />
                        ) : (
                          <Amount value={0n} />
                        )}
                      </p>
                    </div>
                  </div>
                )}
                {hasPreviousBalance && (
                  <div className={classes.withdrawStep1Breakdown}>
                    <div>
                      <p>
                        <b>Withdrawal amount</b>
                      </p>
                      <p>
                        <Amount value={previousAmount - withdrawEstimatedFee} />
                      </p>
                    </div>
                  </div>
                )}

                <Button type="submit">Submit</Button>
                <p className="error">{destinationForm.error}</p>
              </form>
            </div>
          )}
        </ExistingBalance>
        <VideoModal
          src="https://www.youtube-nocookie.com/embed/ordwjaT88I4"
          header="How do I start the transfer?"
          body="Not sure how to tackle this step? Check out our example below."
          isOpen={isWithdrawHelpVideoOpen}
          closeModal={() => setIsWithdrawHelpVideoOpen(false)}
        />
      </Layout>
    )
  }

  return (
    <>
      <Layout
        header={
          <>
            <img src={logo_rose_move_svg} alt="ROSE Move logo" />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
            </div>
          </>
        }
      >
        <div className={classes.step3}>
          {consensusAddress && (
            <div>
              <p className={`body ${classes.withdrawStep4ProgressBarLabel}`}>
                Your ROSE will be moved to this address:
              </p>
              <div className={classes.overrideMaxWidth}>
                <div className={classes.addressWrapper}>
                  <div className={classes.startAdornment}>Destination</div>
                  <div className={classes.address}>
                    <AccountAvatar diameter={24} account={{ address: consensusAddress }} />
                    <div
                      className={
                        !isPrevError && progress.percentage && progress.percentage <= 0.05
                          ? classes.addressLonger
                          : ''
                      }
                    >
                      <ShortAddress address={consensusAddress} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h2 style={{ marginBottom: '-20px' }}>{progress.message}</h2>
          <ProgressBar percentage={progress.percentage || 0} isError={isError} />
          {isBlockingNavigatingAway && (
            <>
              <img src={loader_blocks_svg} alt="" style={{ marginTop: '-20px', width: '106px' }} />
              <div className="warningNotification">
                <img src={symbol_warning_svg} alt="Warning" width="24" />
                <p>
                  Please do not close this window in order to complete the process. If the window is closed
                  you can always recover from the last step and your funds won't be lost.
                </p>
              </div>
            </>
          )}
          {!!progress.percentage && progress.percentage >= 1 && (
            <>
              <img src={symbol_check_circle_svg} alt="" style={{ marginTop: '-20px', width: '106px' }} />
              <Button onClick={transferMore}>Transfer more</Button>
            </>
          )}
          {!generatedConsensusAccount.isFresh && (
            <div style={{ marginTop: '40px' }}>
              <a
                href={`https://explorer.oasis.io/mainnet/sapphire/address/${generatedSapphireAccount.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Show previous transactions
              </a>
            </div>
          )}
          {/*<details>
            <summary>Advanced</summary>
            <br/>
            Transfer to:
            <div className={classes.overrideMaxWidth}>
              <div className={classes.addressWrapper}>
                <div className={classes.startAdornment}>Your address 1</div>
                <div className={classes.address}>
                  <div className={progress.percentage && progress.percentage <= 0.05 ? classes.addressLonger : ''}>
                    <ShortAddress address={generatedSapphireAccount.address}/>
                  </div>
                </div>
                <div>
                  <Button
                    title="Show your private key"
                    className={classes.plainButton}
                    onClick={() => setIsCopySapphirePrivateKeyModalOpen(true)}
                  >
                    <img src={vpn_key_svg} alt="Show your private key" width="24" style={{filter: 'invert(1)'}}/>
                  </Button>
                  <CopyPrivateKeyModal
                    privateKey={generatedSapphireAccount.privateKey}
                    isOpen={isCopySapphirePrivateKeyModalOpen}
                    closeModal={() => setIsCopySapphirePrivateKeyModalOpen(false)}
                  />
                </div>
                <div className={classes.endAdornment}>
                  <ButtonWithClickedIndicator
                    title="Copy address"
                    className={classes.plainButton}
                    onClick={() => window.navigator.clipboard.writeText(generatedSapphireAccount.address)}
                    clickedIndicator={<img src={symbol_check_circle_svg} alt="Copied" width="24"/>}
                  >
                    <img src={file_copy_svg} alt="Copy address" width="24" style={{filter: 'invert(1)'}}/>
                  </ButtonWithClickedIndicator>
                </div>
              </div>
            </div>
            That will be withdrawn into:
            <div className={classes.overrideMaxWidth}>
              <div className={classes.addressWrapper}>
                <div className={classes.startAdornment}>Your address 2</div>
                <div className={classes.address}>
                  <div className={progress.percentage && progress.percentage <= 0.05 ? classes.addressLonger : ''}>
                    <ShortAddress address={generatedConsensusAccount.address}/>
                  </div>
                </div>
                <div>
                  <Button
                    title="Show your private key"
                    className={classes.plainButton}
                    onClick={() => setIsCopyConsensusPrivateKeyModalOpen(true)}
                  >
                    <img src={vpn_key_svg} alt="Show your private key" width="24" style={{filter: 'invert(1)'}}/>
                  </Button>
                  <CopyPrivateKeyModal
                    privateKey={generatedConsensusAccount.privateKey}
                    isOpen={isCopyConsensusPrivateKeyModalOpen}
                    closeModal={() => setIsCopyConsensusPrivateKeyModalOpen(false)}
                  />
                </div>
                <div className={classes.endAdornment}>
                  <ButtonWithClickedIndicator
                    title="Copy address"
                    className={classes.plainButton}
                    onClick={() => window.navigator.clipboard.writeText(generatedConsensusAccount.address)}
                    clickedIndicator={<img src={symbol_check_circle_svg} alt="Copied" width="24"/>}
                  >
                    <img src={file_copy_svg} alt="Copy address" width="24" style={{filter: 'invert(1)'}}/>
                  </ButtonWithClickedIndicator>
                </div>
              </div>
            </div>
            Then transferred to {consensusAddress}
          </details>*/}
        </div>
      </Layout>
    </>
  )
}
