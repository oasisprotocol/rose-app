import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { MoveButton as Button, PrivateKeyHelpModal, VideoModal } from '@oasisprotocol/rose-app-ui/move'
import { Layout } from './components/Layout'
import { useIsRpcResponding } from './utils/useIsRpcResponding'

import videocam_svg from '@material-design-icons/svg/filled/videocam.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import consensus_to_sapphire_svg from '/move/consensus_to_sapphire.svg?url'
import logo_rose_move_svg from '/move/logo_rose_move.svg?url'
import sapphire_to_consensus_svg from '/move/sapphire_to_consensus.svg?url'
import { Deposit } from './deposit/Deposit'
import { useReloadIfAccountSwitched } from './utils/useReloadIfAccountSwitched'
import { Withdraw } from './withdraw/Withdraw'
import { Header } from '@oasisprotocol/rose-app-ui/core'
import { trackEvent } from 'fathom-client'
import { useGenerateConsensusAccount } from './deposit/useGenerateConsensusAccount'
import { useGenerateSapphireAccount } from './withdraw/useGenerateSapphireAccount'

export function App() {
  useReloadIfAccountSwitched()
  const isRpcResponding = useIsRpcResponding()
  const sapphireAddress = useAccount().address
  const deposit = useGenerateConsensusAccount()
  const withdraw = useGenerateSapphireAccount()

  const [isMoveWalkthroughVideoModalOpen, setIsMoveWalkthroughVideoModalOpen] = useState(false)
  const [isPrivateKeyHelpModalOpen, setIsPrivateKeyHelpModalOpen] = useState(false)

  if (!sapphireAddress) {
    return (
      <>
        <Layout header={<Header navLink={null} />}>
          <div className={classes.step1}>
            <div>
              <img src={logo_rose_move_svg} alt="ROSE Move logo" style={{ maxHeight: '67px' }} />
              <p>
                Easily move your ROSE from a crypto exchange or consensus account to Sapphire. Start by
                connecting your wallet.
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
              <button
                type="button"
                className={classes.plainButton2}
                onClick={() => setIsPrivateKeyHelpModalOpen(true)}
              >
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
          <Header logo={<img src={logo_rose_move_svg} alt="ROSE Move logo" />}>
            <div className={classes.headerAccount}>
              <ConnectButton accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }} />
            </div>
          </Header>
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
                <Button
                  onClick={async () => {
                    const generatedConsensusAccount = await deposit.generateConsensusAccount(sapphireAddress)
                    if (generatedConsensusAccount.isFresh) {
                      trackEvent('deposit account created')
                    }
                  }}
                >
                  Select and sign-in
                </Button>
              </div>
            </div>

            <div className={classes.card}>
              <div className={classes.cardHeader}>
                <img className={`${classes.cardImage}`} src={sapphire_to_consensus_svg} alt="" />
              </div>
              <div className={classes.cardContent}>
                <p>Move your ROSE from Sapphire back to a crypto exchange or consensus account.</p>
                <Button
                  onClick={async () => {
                    const { generatedConsensusAccount } =
                      await withdraw.generateSapphireAccount(sapphireAddress)
                    if (generatedConsensusAccount.isFresh) {
                      trackEvent('withdrawal account created')
                    }
                  }}
                >
                  Select and sign-in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (deposit.generatedConsensusAccount) {
    return <Deposit generatedConsensusAccount={deposit.generatedConsensusAccount} />
  }
  if (withdraw.generatedSapphireAccount && withdraw.generatedConsensusAccount) {
    return (
      <Withdraw
        generatedSapphireAccount={withdraw.generatedSapphireAccount}
        generatedConsensusAccount={withdraw.generatedConsensusAccount}
      />
    )
  }
}
