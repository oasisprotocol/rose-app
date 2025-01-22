import { FC } from 'react'
import classes from './index.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { withConnectedWallet } from '../../hoc/withConnectedWallet'

const ConnectWalletCmp: FC = () => {
  return (
    <div>
      <p className={classes.subHeader}>
        Quickly wrap your ROSE into wROSE and vice versa with the (un)wrap ROSE tool.
        <br />
        Please connect your wallet to get started.
      </p>

      <ConnectButton />
    </div>
  )
}

export const ConnectWallet = withConnectedWallet(ConnectWalletCmp)
