import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from '../App.module.css'
import { AccountAvatar } from '../components/AccountAvatar'
import { Button } from '../components/Button'
import { ButtonWithClickedIndicator } from '../components/Button/ButtonWithClickedIndicator'
import { CopyPrivateKeyModal } from '../components/CopyPrivateKeyModal'
import { Hint } from '../components/Hint'
import { Layout } from '../components/Layout'
import ProgressBar from '../components/ProgressBar'
import { ShortAddress } from '../components/ShortAddress'
import { VideoModal } from '../components/VideoModal'
import { useDeposit } from '../useDeposit'

import file_copy_svg from '@material-design-icons/svg/filled/file_copy.svg'
import help_outline_svg from '@material-design-icons/svg/filled/help_outline.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import { useState } from 'react'
import ROSE_Move_Transfer_mp4 from '/ROSE Move Transfer.mp4?url'
import loader_blocks_svg from '/loader_blocks.svg?url'
import logo_rose_move_svg from '/logo_rose_move.svg?url'
import symbol_check_circle_svg from '/symbol_check_circle.svg?url'
import symbol_warning_svg from '/symbol_warning.svg?url'

export function Deposit(props: { deposit: ReturnType<typeof useDeposit> }) {
  const { generatedConsensusAccount, transferMore, progress, isBlockingNavigatingAway, isPrevError } = props.deposit // Parent useDeposit

  const isError = progress.percentage === undefined

  const [isMoveTransferVideoModalOpen, setIsMoveTransferVideoModalOpen] = useState(false)
  const [isCopyPrivateKeyModalOpen, setIsCopyPrivateKeyModalOpen] = useState(false)

  if (!generatedConsensusAccount) throw new Error('<Deposit> used before SIWE')
  return (
    <>
      <Layout
        header={
          <>
            <img src={logo_rose_move_svg} alt="ROSE Move logo" />
            <Hint
              title={(() => {
                if (progress.percentage === undefined) return
                if (progress.percentage <= 0.05) return 'Your ROSE will be sent to this address.'
                if (progress.percentage >= 1) return 'ROSE tokens received at this address'
                return
              })()}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
              </div>
            </Hint>
          </>
        }
      >
        <div className={classes.step3}>
          <div
            className={
              !isPrevError && progress.percentage && progress.percentage <= 0.05
                ? classes.collapsible
                : `${classes.collapsible} ${classes.collapsed}`
            }
          >
            <h1>Your exchange withdrawal address is created! {generatedConsensusAccount.isFresh && '✨'}</h1>
            <p>
              Copy the below address and initiate the withdrawal from your crypto exchange or consensus account to
              continue. Your ROSE Will be automatically moved to your Sapphire address.{' '}
              <button
                type="button"
                className={classes.plainButton2}
                onClick={() => setIsMoveTransferVideoModalOpen(true)}
              >
                <img src={help_outline_svg} alt="Help" width="16" style={{ filter: 'invert(1)' }} />
              </button>
            </p>
          </div>

          <div className={classes.overrideMaxWidth}>
            <div className={classes.addressWrapper}>
              <div className={classes.startAdornment}>Your address</div>
              <div className={classes.address}>
                <AccountAvatar diameter={24} account={{ address: generatedConsensusAccount.address }} />
                <div
                  className={
                    !isPrevError && progress.percentage && progress.percentage <= 0.05 ? classes.addressLonger : ''
                  }
                >
                  <ShortAddress address={generatedConsensusAccount.address} />
                </div>
              </div>
              <div>
                <Button
                  title="Show your private key"
                  className={classes.plainButton}
                  onClick={() => setIsCopyPrivateKeyModalOpen(true)}
                >
                  <img src={vpn_key_svg} alt="Show your private key" width="24" style={{ filter: 'invert(1)' }} />
                </Button>
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

          <h2 style={{ marginBottom: '-20px' }}>{progress.message}</h2>
          <ProgressBar percentage={progress.percentage || 0} isError={isError} />

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
                // TODO: update when production supports Consensus
                href={`https://explorer.dev.oasis.io/mainnet/consensus/address/${generatedConsensusAccount.address}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Show previous transactions
              </a>
            </div>
          )}
        </div>
      </Layout>
      <VideoModal
        src={ROSE_Move_Transfer_mp4}
        header="How do I start the transfer?"
        body="Not sure how to tackle this step? Check out our example below."
        isOpen={isMoveTransferVideoModalOpen}
        closeModal={() => setIsMoveTransferVideoModalOpen(false)}
      />
      <CopyPrivateKeyModal
        privateKey={generatedConsensusAccount.privateKey}
        isOpen={isCopyPrivateKeyModalOpen}
        closeModal={() => setIsCopyPrivateKeyModalOpen(false)}
      />
    </>
  )
}
