import { ConnectButton } from '@rainbow-me/rainbowkit'
import { FC } from 'react'
import classes from './index.module.css'
import { useMatch } from 'react-router-dom'

export const SidebarAccount: FC = () => {
  const isLandingPage = useMatch('/')
  const isDiscoverPage = useMatch('/discover')

  if (isLandingPage || isDiscoverPage) {
    return null
  }

  return (
    <>
      <hr />{' '}
      <div className={classes.sidebarAccount}>
        <ConnectButton accountStatus="full" chainStatus="full" showBalance />
      </div>
    </>
  )
}
