import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC } from 'react'
import classes from './index.module.css'

export const SidebarAccount: FC = () => {
  return (
    <>
      <hr />{' '}
      <div className={classes.sidebarAccount}>
        <ConnectButton accountStatus="full" chainStatus="full" showBalance />
      </div>
    </>
  )
}
