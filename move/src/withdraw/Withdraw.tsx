import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from '../App.module.css'
import { Button } from '../components/Button'
import { ButtonWithClickedIndicator } from '../components/Button/ButtonWithClickedIndicator'
import { CopyPrivateKeyModal } from '../components/CopyPrivateKeyModal'
import { Layout } from '../components/Layout'
import ProgressBar from '../components/ProgressBar'
import { ShortAddress } from '../components/ShortAddress'
import { useWithdraw } from '../useWithdraw'

import file_copy_svg from '@material-design-icons/svg/filled/file_copy.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import { staking } from '@oasisprotocol/client'
import { useState } from 'react'
import loader_blocks_svg from '/loader_blocks.svg?url'
import logo_rose_move_svg from '/logo_rose_move.svg?url'
import symbol_check_circle_svg from '/symbol_check_circle.svg?url'
import symbol_warning_svg from '/symbol_warning.svg?url'

function isValidOasisAddress(addr: string): boolean {
  try {
    staking.addressFromBech32(addr)
    return true
  } catch (e) {
    return false
  }
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
  } = props.withdraw // Parent useWithdraw

  const isError = progress.percentage === undefined

  const [isCopySapphirePrivateKeyModalOpen, setIsCopySapphirePrivateKeyModalOpen] = useState(false)
  const [isCopyConsensusPrivateKeyModalOpen, setIsCopyConsensusPrivateKeyModalOpen] = useState(false)

  if (!generatedConsensusAccount) throw new Error('<Withdraw> used before SIWE')
  if (!generatedSapphireAccount) throw new Error('<Withdraw> used before SIWE')
  if (!consensusAddress) {
    return (
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
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // @ts-expect-error Missing types
            const consensusAddress = e.currentTarget.elements.consensusAddress.value
            setConsensusAddress(consensusAddress)
            step3(consensusAddress)
          }}
        >
          Where do you want your funds to be sent to?
          <input
            name="consensusAddress"
            required
            onChange={(e) => {
              e.currentTarget.setCustomValidity(
                isValidOasisAddress(e.currentTarget.value) ? '' : 'Invalid oasis1 address',
              )
            }}
          />
          <button type="submit">Submit</button>
        </form>
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
          <div
            className={
              progress.percentage && progress.percentage <= 0.05
                ? classes.collapsible
                : `${classes.collapsible} ${classes.collapsed}`
            }
          >
            <h1>Address created and awaiting your transfer {generatedConsensusAccount.isFresh && '✨'}</h1>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                // trigger transfer
                step4(
                  // @ts-expect-error Missing types
                  e.currentTarget.elements.amount.value,
                )
              }}
            >
              Amount:
              <input name="amount" type="number" step="any" required />
              <button type="submit">Submit</button>
              (balance: {availableBalance?.formatted} {availableBalance?.symbol})
            </form>
          </div>
          <h2 style={{ marginBottom: '-20px' }}>{progress.message}</h2>
          <ProgressBar percentage={progress.percentage || 0} isError={isError} />
          Your funds will be sent to this address: {consensusAddress}
          {isBlockingNavigatingAway && (
            <>
              <img src={loader_blocks_svg} alt="" style={{ marginTop: '-20px', width: '106px' }} />
              <div className="warningNotification">
                <img src={symbol_warning_svg} alt="Warning" width="24" />
                <p>
                  Please do not close this window in order to complete the process. If the window is closed you can
                  always recover from the last step and your funds won't be lost.
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
          <details>
            <summary>Advanced</summary>
            <br />
            Transfer to:
            <div className={classes.overrideMaxWidth}>
              <div className={classes.addressWrapper}>
                <div className={classes.startAdornment}>Your address 1</div>
                <div className={classes.address}>
                  <div className={progress.percentage && progress.percentage <= 0.05 ? classes.addressLonger : ''}>
                    <ShortAddress address={generatedSapphireAccount.address} />
                  </div>
                </div>
                <div>
                  <Button
                    title="Show your private key"
                    className={classes.plainButton}
                    onClick={() => setIsCopySapphirePrivateKeyModalOpen(true)}
                  >
                    <img src={vpn_key_svg} alt="Show your private key" width="24" style={{ filter: 'invert(1)' }} />
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
                    clickedIndicator={<img src={symbol_check_circle_svg} alt="Copied" width="24" />}
                  >
                    <img src={file_copy_svg} alt="Copy address" width="24" style={{ filter: 'invert(1)' }} />
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
                    <ShortAddress address={generatedConsensusAccount.address} />
                  </div>
                </div>
                <div>
                  <Button
                    title="Show your private key"
                    className={classes.plainButton}
                    onClick={() => setIsCopyConsensusPrivateKeyModalOpen(true)}
                  >
                    <img src={vpn_key_svg} alt="Show your private key" width="24" style={{ filter: 'invert(1)' }} />
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
                    clickedIndicator={<img src={symbol_check_circle_svg} alt="Copied" width="24" />}
                  >
                    <img src={file_copy_svg} alt="Copy address" width="24" style={{ filter: 'invert(1)' }} />
                  </ButtonWithClickedIndicator>
                </div>
              </div>
            </div>
            Then transferred to {consensusAddress}
          </details>
        </div>
      </Layout>
    </>
  )
}
