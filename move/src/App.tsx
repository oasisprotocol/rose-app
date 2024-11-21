import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { Button } from './components/Button'
import { Layout } from './components/Layout'
import { PrivateKeyHelpModal } from './components/PrivateKeyHelpModal'
import { VideoModal } from './components/VideoModal'
import { useDeposit } from './useDeposit'
import { useWithdraw } from './useWithdraw'
import { useIsRpcResponding } from './utils/useIsRpcResponding'

import videocam_svg from '@material-design-icons/svg/filled/videocam.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import consensus_to_sapphire_svg from '/consensus_to_sapphire.svg?url'
import logo_rose_move_svg from '/logo_rose_move.svg?url'
import sapphire_to_consensus_svg from '/sapphire_to_consensus.svg?url'
import { Deposit } from './deposit/Deposit'
import { useReloadIfAccountSwitched } from './utils/useReloadIfAccountSwitched'
import { Withdraw } from './withdraw/Withdraw'

export function App() {
  useReloadIfAccountSwitched()
  const isRpcResponding = useIsRpcResponding()
  const sapphireAddress = useAccount().address
  const deposit = useDeposit()
  const withdraw = useWithdraw()

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
                Easily move your ROSE from a crypto exchange or consensus account to Sapphire. Start by connecting your
                wallet.
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
            <div className={classes.helpLinks}>
              <button
                type="button"
                className={classes.plainButton2}
                onClick={() => setIsMoveWalkthroughVideoModalOpen(true)}
              >
                <img src={videocam_svg} alt="" width="36" style={{ filter: 'invert(1)' }} />
                <div>
                  <h3>Watch this walkthrough to get started.</h3>
                  <div>Learn how to use Move</div>
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
          src="https://www.youtube-nocookie.com/embed/2AEBhbArV0k"
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
  if (!deposit.generatedConsensusAccount && !withdraw.generatedConsensusAccount) {
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
        <div className={classes.step2}>
          <div>
            <h1>Where do you want to move your ROSE?</h1>
            <p>Choose the destination to move your ROSE. Select and sign-in to verify.</p>
          </div>
          <div className={classes.cards}>
            <div className={classes.card}>
              <div className={classes.cardHeader}>
                <img className={classes.cardImage} src={consensus_to_sapphire_svg} alt="" />
              </div>
              <div className={classes.cardContent}>
                <p>Easily move your ROSE from a crypto exchange or consensus account to use on Sapphire.</p>
                <Button onClick={deposit.step2}>Select and sign-in</Button>
              </div>
            </div>

            <div className={classes.card}>
              <div className={classes.cardHeader}>
                <img className={`${classes.cardImage}`} src={sapphire_to_consensus_svg} alt="" />
              </div>
              <div className={classes.cardContent}>
                <p>Move your ROSE from Sapphire back to a crypto exchange or consensus account.</p>
                <Button onClick={withdraw.step2}>Select and sign-in</Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (deposit.generatedConsensusAccount) {
    return <Deposit deposit={deposit} />
  }
  if (withdraw.generatedConsensusAccount) {
    return <Withdraw withdraw={withdraw} />
  }
}
