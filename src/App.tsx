import { ConnectButton } from '@rainbow-me/rainbowkit'
import { AccountAvatar } from './components/AccountAvatar'
import { useDeposit } from './useDeposit'

export function App() {
  const { sapphireAddress, consensusAccount, step2, progress, isBlockingNavigatingAway } = useDeposit()

  if (!sapphireAddress) {
    return (
      <div>
        <p style={{ maxWidth: '670px' }}>
          The Rose (on)ramp dApp has been built by Oasis to offer users an easy to use service of moving your Rose from
          any centralized exchange to Sapphire (Metamask), without having to handle a Rose Wallet. Connect below and
          follow the steps to complete your transfer.
        </p>
        {/* step1 */}
        <ConnectButton />
      </div>
    )
  }
  if (!consensusAccount) {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ConnectButton />
        </div>

        <p>Consensus to Sapphire</p>
        <button type="button" onClick={step2}>
          Select and sign-in
        </button>

        <p>Sapphire to Consensus</p>
        <button type="button" disabled>
          Coming soon
        </button>
      </div>
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
