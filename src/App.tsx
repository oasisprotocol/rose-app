import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { AccountAvatar } from './components/AccountAvatar'
import { Button } from './components/Button'
import { Hint } from './components/Hint'
import { Layout } from './components/Layout'
import { ShortAddress } from './components/ShortAddress'
import { useDeposit } from './useDeposit'

import file_copy_svg from '@material-design-icons/svg/filled/file_copy.svg'
import help_outline_svg from '@material-design-icons/svg/filled/help_outline.svg'
import open_in_new_svg from '@material-design-icons/svg/filled/open_in_new.svg'
import videocam_svg from '@material-design-icons/svg/filled/videocam.svg'
import vpn_key_svg from '@material-design-icons/svg/filled/vpn_key.svg'
import consensus_to_sapphire_svg from '/consensus_to_sapphire.svg?url'
import help_html from '/help.html?url'
import loader_blocks_svg from '/loader_blocks.svg?url'
import logo_oasis_network_svg from '/logo_oasis_network.svg?url'
import logo_rose_on_ramp_svg from '/logo_rose_on_ramp.svg?url'
import sapphire_to_consensus_svg from '/sapphire_to_consensus.svg?url'
import symbol_check_circle_svg from '/symbol_check_circle.svg?url'
import symbol_warning_svg from '/symbol_warning.svg?url'

export function App() {
  const { sapphireAddress, consensusAccount, step2, transferMore, progress, isBlockingNavigatingAway } = useDeposit()

  if (!sapphireAddress) {
    return (
      <Layout header={<img src={logo_oasis_network_svg} alt="Oasis Network" />}>
        <div className={classes.step1}>
          <div>
            <img src={logo_rose_on_ramp_svg} alt="ROSE on-ramp" style={{ maxWidth: '70vw' }} />
            <p>
              The Rose (on)ramp dApp has been built by Oasis to offer users an easy to use service of moving your Rose
              from any centralized exchange to Sapphire (Metamask), without having to handle a Rose Wallet. Connect
              below and follow the steps to complete your transfer.
            </p>
          </div>
          <ConnectButton />

          <div></div>
          <div>Discover more info below</div>
          <div className={classes.helpLinks}>
            <a href={help_html} target="_blank" rel="noopener noreferrer">
              <img src={videocam_svg} alt="" width="36" style={{ filter: 'invert(1)' }} />
              <div>
                <h3>Need help? Watch the walkthrough</h3>
                <div>Watch the video on how to use the dApp</div>
              </div>
            </a>
          </div>
        </div>
      </Layout>
    )
  }
  if (!consensusAccount) {
    return (
      <Layout
        header={
          <>
            <img src={logo_rose_on_ramp_svg} alt="ROSE on-ramp" />
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
    <Layout
      header={
        <>
          <img src={logo_rose_on_ramp_svg} alt="ROSE on-ramp" />
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
        <div>
          <h1>Address created and awaiting your transfer {consensusAccount.isFresh && '✨'}</h1>
          <p>
            Use the generated address below to initiate the transfer on your centralized exchange. The dApp
            automatically recognizes your transfer form the centralized exchange and will track it.{' '}
            <a href={help_html} target="_blank" rel="noopener noreferrer">
              <img src={help_outline_svg} alt="Help" width="16" style={{ filter: 'invert(1)' }} />
            </a>
          </p>
        </div>

        <div className={classes.overrideMaxWidth}>
          <div className={classes.addressWrapper}>
            <div className={classes.startAdornment}>Your address</div>
            <div className={classes.address}>
              <AccountAvatar diameter={24} account={{ address: consensusAccount.address }} />
              {progress.percentage && progress.percentage <= 0.05 ? (
                <div className={classes.addressLonger}>
                  <ShortAddress address={consensusAccount.address} />
                </div>
              ) : (
                <ShortAddress address={consensusAccount.address} />
              )}
            </div>
            <div>
              <Button
                title="Show your private key"
                className={classes.plainButton}
                onClick={() =>
                  window.prompt(
                    'Your private key\n\n' +
                      'Below the private key of your Consensus address is shown. Copy the private key and paste it ' +
                      'into web wallet and gain full control. To keep full access to your wallet we highly recommend ' +
                      'you store the full private key, in the right order, in a secure location.',
                    consensusAccount.privateKey,
                  )
                }
              >
                <img src={vpn_key_svg} alt="Show your private key" width="24" style={{ filter: 'invert(1)' }} />
              </Button>
            </div>
            <div className={classes.endAdornment}>
              <Button
                title="Copy address"
                className={classes.plainButton}
                onClick={() => window.navigator.clipboard.writeText(consensusAccount.address)}
              >
                <img src={file_copy_svg} alt="Copy address" width="24" style={{ filter: 'invert(1)' }} />
              </Button>
            </div>
          </div>
        </div>

        <h2 style={{ marginBottom: '-20px' }}>{progress.message}</h2>
        <progress value={progress.percentage} max={1} />

        {isBlockingNavigatingAway && (
          <>
            <img src={loader_blocks_svg} alt="" style={{ marginTop: '-20px', width: '106px' }} />
            <div className={classes.doNotClose}>
              <img src={symbol_warning_svg} alt="Warning" width="24" />
              <p>
                Please do not close this window in order to complete the process. If the window is closed you can always
                recover from the last step and your funds won't be lost.
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
      </div>
    </Layout>
  )
}
