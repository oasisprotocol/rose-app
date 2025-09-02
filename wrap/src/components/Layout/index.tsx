import { FC, PropsWithChildren } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { WrapLogoIcon } from '../Logo/WrapLogoIcon'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useMediaQuery } from 'react-responsive'
import classes from './index.module.css'
import { Header } from '@oasisprotocol/rose-app-ui/core'
import { cn } from '@oasisprotocol/ui-library/src'

export const Layout: FC<PropsWithChildren> = () => {
  const isHomePage = useMatch('/wrap')
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1023px)' })

  return (
    <div className={cn(classes.layout)}>
      <Header
        navLink={
          !isHomePage && (
            <NavLink
              className={classes.headerLink}
              to="/wrap/wrapper"
              style={{ visibility: isHomePage ? 'hidden' : 'visible' }}
            >
              <WrapLogoIcon />
            </NavLink>
          )
        }
      >
        {isHomePage && <div />}
        {!isHomePage && !isMobileScreen && <ConnectButton />}
      </Header>
      <main className={classes.main}>
        <Outlet />
      </main>
    </div>
  )
}
