import { ConnectButton } from '@rainbow-me/rainbowkit'
import classes from './App.module.css'
import { AccountAvatar } from './components/AccountAvatar'
import { Hint } from './components/Hint'
import { Layout } from './components/Layout'
import { useDeposit } from './useDeposit'

export function App() {
  const { sapphireAddress, consensusAccount, step2, progress, isBlockingNavigatingAway } = useDeposit()

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
                <button type="button" onClick={step2}>
                  Select and sign-in
                </button>
              </div>
            </div>

            <div className={classes.card}>
              <img className={`${classes.cardImage} ${classes.opacity50}`} src="/sapphire-to-consensus.svg" alt="" />
              <div className={classes.cardContent}>
                <h2>Sapphire to Consensus</h2>
                <p>Move ROSE from Sapphire to your Consensus account (e.g. centralized exchange).</p>
                <button type="button" disabled>
                  Coming soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ConnectButton />
        </div>

        <h2>Address created and awaiting your transfer</h2>
        <p style={{ maxWidth: '670px' }}>
          Use the generated address below to initiate the transfer on your centralized exchange. The dApp automatically
          recognizes your transfer form the centralized exchange and will track it.
        </p>

        <div>
          Your address &nbsp;
          <AccountAvatar diameter={24} account={{ address: consensusAccount.address }} />
          {consensusAccount.address}
          &nbsp;
          <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.address)}>
            Copy address &#x2398;
          </button>
          &nbsp;
          <button type="button" onClick={() => window.navigator.clipboard.writeText(consensusAccount.privateKey)}>
            Copy private key &#x2398;
          </button>
        </div>
        <br />
        <br />
        {progress.message}
        <br />
        <progress id="file" value={progress.percentage} max={1} style={{ width: '30vw', height: '32px' }} />
        <br />
        <br />
        <br />
        <br />

        {isBlockingNavigatingAway && (
          <p style={{ maxWidth: '670px' }}>
            Please do not close this window in order to complete the process. If the window is closed you can always
            recover from the last step and your funds won't be lost.
          </p>
        )}
      </div>
    </div>
  )
}
