import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { Button } from './components/Button'
import { Hint } from './components/Hint'
import { Layout } from './components/Layout'
import { PrivateKeyHelpModal } from './components/PrivateKeyHelpModal'
import { VideoModal } from './components/VideoModal'
import { useDeposit } from './useDeposit'
import { useIsRpcResponding } from './utils/useIsRpcResponding'

import open_in_new_svg from '@material-design-icons/svg/filled/open_in_new.svg'
import videocam_svg from '@material-design-icons/svg/filled/videocam.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import ROSE_Move_Walkthrough_mp4 from '/ROSE Move Walkthrough.mp4?url'
import consensus_to_sapphire_svg from '/consensus_to_sapphire.svg?url'
import logo_rose_move_svg from '/logo_rose_move.svg?url'
import sapphire_to_consensus_svg from '/sapphire_to_consensus.svg?url'
import { Deposit } from './deposit/Deposit'
import { useReloadIfAccountSwitched } from './utils/useReloadIfAccountSwitched'

export function App() {
  useReloadIfAccountSwitched()
  const isRpcResponding = useIsRpcResponding()
  const sapphireAddress = useAccount().address
  const deposit = useDeposit()

  const [isMoveWalkthroughVideoModalOpen, setIsMoveWalkthroughVideoModalOpen] = useState(false)
  const [isPrivateKeyHelpModalOpen, setIsPrivateKeyHelpModalOpen] = useState(false)

  if (!sapphireAddress) {
    return (
      <>
        <Layout header={<img src={logo_rose_move_svg} alt="" style={{ visibility: 'hidden' }} />}>
          <div className={classes.step1}>
            <div>
              <img src={logo_rose_move_svg} alt="ROSE Move logo" style={{ maxHeight: '67px' }} />
              <p>
                Easily move your ROSE tokens from your Consensus account (e.g. on a crypto exchange) to your Sapphire
                account (e.g. in Metamask), or vice versa. Connect your wallet and follow the next steps.
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
            <div>Discover more info below:</div>
            <div className={classes.helpLinks}>
              <button
                type="button"
                className={classes.plainButton2}
                onClick={() => setIsMoveWalkthroughVideoModalOpen(true)}
              >
                <img src={videocam_svg} alt="" width="36" style={{ filter: 'invert(1)' }} />
                <div>
                  <h3>Need help? Watch the walkthrough</h3>
                  <div>Watch the video on how to use the dApp</div>
                </div>
              </button>
              <button type="button" className={classes.plainButton2} onClick={() => setIsPrivateKeyHelpModalOpen(true)}>
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
          src={ROSE_Move_Walkthrough_mp4}
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
  if (!deposit.generatedConsensusAccount) {
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
            <p>
              Choose the destination network where you want to move your ROSE tokens to. You will be asked to sign a
              message from which your unique Consensus account will be derived.
            </p>
          </div>
          <div className={classes.cards}>
            <div className={classes.card}>
              <img className={classes.cardImage} src={consensus_to_sapphire_svg} alt="" />
              <div className={classes.cardContent}>
                <h2>Consensus to Sapphire</h2>
                <p>
                  Move ROSE from your Consensus account (e.g. on an exchange) to your Sapphire account (e.g. in
                  MetaMask).
                </p>
                <Button onClick={deposit.step2}>Select and sign-in</Button>
              </div>
            </div>

            <div className={classes.card}>
              <img className={`${classes.cardImage} ${classes.opacity50}`} src={sapphire_to_consensus_svg} alt="" />
              <div className={classes.cardContent}>
                <h2>Sapphire to Consensus</h2>
                <p>
                  Move ROSE from your Sapphire account (e.g. in MetaMask) to your Consensus account (e.g. an exchange).
                </p>
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

  return <Deposit deposit={deposit} />
}
