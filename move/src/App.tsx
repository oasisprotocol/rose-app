import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { AccountAvatar } from './components/AccountAvatar'
import { Button } from './components/Button'
import { ButtonWithClickedIndicator } from './components/Button/ButtonWithClickedIndicator'
import { CopyPrivateKeyModal } from './components/CopyPrivateKeyModal'
import { Hint } from './components/Hint'
import { Layout } from './components/Layout'
import { PrivateKeyHelpModal } from './components/PrivateKeyHelpModal'
import ProgressBar from './components/ProgressBar'
import { ShortAddress } from './components/ShortAddress'
import { VideoModal } from './components/VideoModal'
import { useDeposit } from './useDeposit'
import { useIsRpcResponding } from './utils/useIsRpcResponding'

import file_copy_svg from '@material-design-icons/svg/filled/file_copy.svg'
import help_outline_svg from '@material-design-icons/svg/filled/help_outline.svg'
import open_in_new_svg from '@material-design-icons/svg/filled/open_in_new.svg'
import videocam_svg from '@material-design-icons/svg/filled/videocam.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import { useState } from 'react'
import consensus_to_sapphire_svg from '/consensus_to_sapphire.svg?url'
import loader_blocks_svg from '/loader_blocks.svg?url'
import logo_rose_move_svg from '/logo_rose_move.svg?url'
import sapphire_to_consensus_svg from '/sapphire_to_consensus.svg?url'
import symbol_check_circle_svg from '/symbol_check_circle.svg?url'
import symbol_warning_svg from '/symbol_warning.svg?url'

export function App() {
  const isRpcResponding = useIsRpcResponding()
  const { sapphireAddress, consensusAccount, step2, transferMore, progress, isBlockingNavigatingAway } = useDeposit()

  const isError = progress.percentage === undefined

  const [isMoveWalkthroughVideoModalOpen, setIsMoveWalkthroughVideoModalOpen] = useState(false)
  const [isPrivateKeyHelpModalOpen, setIsPrivateKeyHelpModalOpen] = useState(false)
  const [isMoveTransferVideoModalOpen, setIsMoveTransferVideoModalOpen] = useState(false)
  const [isCopyPrivateKeyModalOpen, setIsCopyPrivateKeyModalOpen] = useState(false)

  const toggleMoveWalkthroughVideoModal = () => setIsMoveWalkthroughVideoModalOpen(!isMoveWalkthroughVideoModalOpen)
  const togglePrivateKeyHelpModal = () => setIsPrivateKeyHelpModalOpen(!isPrivateKeyHelpModalOpen)
  const toggleMoveTransferVideoModal = () => setIsMoveTransferVideoModalOpen(!isMoveTransferVideoModalOpen)
  const toggleCopyPrivateKeyModal = () => setIsCopyPrivateKeyModalOpen(!isCopyPrivateKeyModalOpen)

  if (!sapphireAddress) {
    return (
      <>
        <Layout header={<img src={logo_rose_move_svg} alt="" style={{ visibility: 'hidden' }} />}>
          <div className={classes.step1}>
            <div>
              <img src={logo_rose_move_svg} alt="ROSE Move logo" style={{ maxWidth: '70cqw', maxHeight: '75px' }} />
              <p>
                The Rose Move dApp has been built by Oasis to offer users an easy to use service of moving your Rose
                from any centralized exchange to Sapphire (Metamask), without having to handle a Rose Wallet. Connect
                below and follow the steps to complete your transfer.
              </p>
            </div>
            {isRpcResponding ? (
              <div className={classes.roundConnectButton}>
                <ConnectButton />
              </div>
            ) : (
              <Button disabled>Connect Wallet</Button>
            )}

            <div></div>
            <div>Discover more info below</div>
            <div className={classes.helpLinks}>
              <button type="button" className={classes.plainButton2} onClick={toggleMoveWalkthroughVideoModal}>
                <img src={videocam_svg} alt="" width="36" style={{ filter: 'invert(1)' }} />
                <div>
                  <h3>Need help? Watch the walkthrough</h3>
                  <div>Watch the video on how to use the dApp</div>
                </div>
              </button>
              <button type="button" className={classes.plainButton2} onClick={togglePrivateKeyHelpModal}>
                <img src={vpn_key_svg} alt="" width="36" style={{ filter: 'invert(1)' }} />
                <div>
                  <h3>Lost your private key?</h3>
                  <div>What to do if you lost your private key</div>
                </div>
              </button>
            </div>
          </div>
        </Layout>
        <VideoModal
          src="./ROSE Move Walkthrough.mp4"
          header="How do I use ROSE move?"
          body="Our walkthrough below shows you what the process would look like. The exact process might differ from your
        experience depending on the exchange you are using."
          isOpen={isMoveWalkthroughVideoModalOpen}
          closeModal={() => setIsMoveWalkthroughVideoModalOpen(false)}
        />
        <PrivateKeyHelpModal
          isOpen={isPrivateKeyHelpModalOpen}
          closeModal={() => setIsPrivateKeyHelpModalOpen(false)}
        />
      </>
    )
  }
  if (!consensusAccount) {
    return (
      <Layout
        header={
          <>
            <img src={logo_rose_move_svg} alt="ROSE Move logo" />
            <Hint title="Your funds will be sent to this address.">
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
              </div>
            </Hint>
          </>
        }
      >
        <div className={classes.step2}>
          <div>
            <h1>Where do you want to move your ROSE?</h1>
            <p>Choose where you want to move your ROSE for the dApp to create a unique wallet address for you.</p>
          </div>
          <div className={classes.cards}>
            <div className={classes.card}>
              <img className={classes.cardImage} src={consensus_to_sapphire_svg} alt="" />
              <div className={classes.cardContent}>
                <h2>Consensus to Sapphire</h2>
                <p>Move ROSE from your Consensus account (e.g. centralized exchange) to Sapphire.</p>
                <Button onClick={step2}>Select and sign-in</Button>
              </div>
            </div>

            <div className={classes.card}>
              <img className={`${classes.cardImage} ${classes.opacity50}`} src={sapphire_to_consensus_svg} alt="" />
              <div className={classes.cardContent}>
                <h2>Sapphire to Consensus</h2>
                <p>Move ROSE from Sapphire to your Consensus account (e.g. centralized exchange).</p>
                <Button disabled>Coming soon</Button>
                <Button
                  onClick={() => open('https://wallet.oasis.io/')}
                  style={{
                    position: 'absolute',
                    marginTop: -50,
                  }}
                >
                  Instead use our ROSE Wallet &nbsp;&nbsp;&nbsp;&nbsp;
                  <img src={open_in_new_svg} alt="" width="24" style={{ filter: 'invert(1)' }} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <>
      <Layout
        header={
          <>
            <img src={logo_rose_move_svg} alt="ROSE Move logo" />
            <Hint
              title={(() => {
                if (progress.percentage === undefined) return
                if (progress.percentage <= 0.05) return 'Your funds will be sent to this address.'
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
              progress.percentage && progress.percentage <= 0.05
                ? classes.collapsible
                : `${classes.collapsible} ${classes.collapsed}`
            }
          >
            <h1>Address created and awaiting your transfer {consensusAccount.isFresh && '✨'}</h1>
            <p>
              Use the generated address below to initiate the transfer on your centralized exchange. The dApp
              automatically recognizes your transfer form the centralized exchange and will track it.{' '}
              <button type="button" className={classes.plainButton2} onClick={toggleMoveTransferVideoModal}>
                <img src={help_outline_svg} alt="Help" width="16" style={{ filter: 'invert(1)' }} />
              </button>
            </p>
          </div>

          <div className={classes.overrideMaxWidth}>
            <div className={classes.addressWrapper}>
              <div className={classes.startAdornment}>Your address</div>
              <div className={classes.address}>
                <AccountAvatar diameter={24} account={{ address: consensusAccount.address }} />
                <div className={progress.percentage && progress.percentage <= 0.05 ? classes.addressLonger : ''}>
                  <ShortAddress address={consensusAccount.address} />
                </div>
              </div>
              <div>
                <Button
                  title="Show your private key"
                  className={classes.plainButton}
                  onClick={toggleCopyPrivateKeyModal}
                >
                  <img src={vpn_key_svg} alt="Show your private key" width="24" style={{ filter: 'invert(1)' }} />
                </Button>
              </div>
              <div className={classes.endAdornment}>
                <ButtonWithClickedIndicator
                  title="Copy address"
                  className={classes.plainButton}
                  onClick={() => window.navigator.clipboard.writeText(consensusAccount.address)}
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

          {progress.percentage && progress.percentage >= 1 && (
            <>
              <img src={symbol_check_circle_svg} alt="" style={{ marginTop: '-20px', width: '106px' }} />
              <Button onClick={transferMore}>Transfer more</Button>
            </>
          )}

          {!consensusAccount.isFresh && (
            <div style={{ marginTop: '40px' }}>
              <a
                // TODO: update when production supports Consensus
                href={`https://explorer.dev.oasis.io/mainnet/consensus/address/${consensusAccount.address}`}
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
        src="./ROSE Move Transfer.mp4"
        header="How do I start the transfer?"
        body="Not sure how to tackle this step? Check out our example below."
        isOpen={isMoveTransferVideoModalOpen}
        closeModal={() => setIsMoveTransferVideoModalOpen(false)}
      />
      <CopyPrivateKeyModal
        privateKey={consensusAccount.privateKey}
        isOpen={isCopyPrivateKeyModalOpen}
        closeModal={() => setIsCopyPrivateKeyModalOpen(false)}
      />
    </>
  )
}
