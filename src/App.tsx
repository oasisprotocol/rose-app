import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { AccountAvatar } from './components/AccountAvatar'
import { Button } from './components/Button'
import { Hint } from './components/Hint'
import { Layout } from './components/Layout'
import { ShortAddress } from './components/ShortAddress'
import { useDeposit } from './useDeposit'

export function App() {
  const { sapphireAddress, consensusAccount, step2, transferMore, progress, isBlockingNavigatingAway } = useDeposit()

  if (!sapphireAddress) {
    return (
      <Layout header={<img src="/logo-oasis-network.svg" alt="Oasis Network" />}>
        <div className={classes.step1}>
          <div>
            <img src="/logo-rose-on-ramp.svg" alt="ROSE on-ramp" />
            <p>
              The Rose (on)ramp dApp has been built by Oasis to offer users an easy to use service of moving your Rose
              from any centralized exchange to Sapphire (Metamask), without having to handle a Rose Wallet. Connect
              below and follow the steps to complete your transfer.
            </p>
          </div>
          <ConnectButton />
        </div>
      </Layout>
    )
  }
  if (!consensusAccount) {
    return (
      <Layout
        header={
          <>
            <img src="/logo-rose-on-ramp.svg" alt="ROSE on-ramp" />
            <Hint title="Your funds will be sent to this address.">
              <ConnectButton />
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
              <img className={classes.cardImage} src="/consensus-to-sapphire.svg" alt="" />
              <div className={classes.cardContent}>
                <h2>Consensus to Sapphire</h2>
                <p>Move ROSE from your Consensus account (e.g. centralized exchange) to Sapphire.</p>
                <Button onClick={step2}>Select and sign-in</Button>
              </div>
            </div>

            <div className={classes.card}>
              <img className={`${classes.cardImage} ${classes.opacity50}`} src="/sapphire-to-consensus.svg" alt="" />
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
                  Instead use our ROSE Wallet &nbsp;&nbsp;&nbsp;&nbsp; ↗
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
          <img src="/logo-rose-on-ramp.svg" alt="ROSE on-ramp" />
          <Hint
            title={(() => {
              if (progress.percentage === undefined) return ''
              if (progress.percentage <= 0.05) return 'Your funds will be sent to this address.'
              if (progress.percentage >= 1) return 'ROSE tokens received at this address'
              return ''
            })()}
          >
            <ConnectButton />
          </Hint>
        </>
      }
    >
      <div className={classes.step3}>
        <div>
          <h1>Address created and awaiting your transfer</h1>
          <p>
            Use the generated address below to initiate the transfer on your centralized exchange. The dApp
            automatically recognizes your transfer form the centralized exchange and will track it.
          </p>
        </div>

        <div className={classes.addressWrapper}>
          <div className={classes.startAdornment}>Your address</div>
          <div className={classes.address}>
            <AccountAvatar diameter={24} account={{ address: consensusAccount.address }} />
            {progress.percentage && progress.percentage <= 0.05 ? (
              <span>{consensusAccount.address}</span>
            ) : (
              <ShortAddress address={consensusAccount.address} />
            )}
          </div>
          <div className={classes.endAdornment}>
            <Button
              title="Copy address"
              className={classes.addressButton}
              onClick={() => window.navigator.clipboard.writeText(consensusAccount.address)}
            >
              {progress.percentage && progress.percentage <= 0.05 ? <span>Copy address 📋️</span> : <span>📋️</span>}
            </Button>
            <Button
              title="Copy private key"
              className={classes.addressButton}
              onClick={() => window.navigator.clipboard.writeText(consensusAccount.privateKey)}
            >
              {progress.percentage && progress.percentage <= 0.05 ? <span>Copy private key 🔐️</span> : <span>🔐️</span>}
            </Button>
          </div>
        </div>

        <h2 style={{ marginBottom: '-20px' }}>{progress.message}</h2>
        <progress value={progress.percentage} max={1} />

        {isBlockingNavigatingAway && (
          <>
            <img src="/loader-blocks.svg" alt="" style={{ marginTop: '-20px', width: '106px' }} />
            <div className={classes.doNotClose}>
              <img src="/symbol-warning.svg" alt="Warning" width="24" />
              <p>
                Please do not close this window in order to complete the process. If the window is closed you can always
                recover from the last step and your funds won't be lost.
              </p>
            </div>
          </>
        )}

        {progress.percentage && progress.percentage >= 1 && (
          <>
            <img src="/symbol-check-circle.svg" alt="" style={{ marginTop: '-20px', width: '106px' }} />
            <Button onClick={transferMore}>Transfer more</Button>
          </>
        )}
      </div>
    </Layout>
  )
}
