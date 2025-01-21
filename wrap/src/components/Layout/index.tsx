import { FC, PropsWithChildren } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import classes from './index.module.css'
import { LogoIcon } from '../icons/LogoIcon'
import { Header, LayoutBase } from '@oasisprotocol/rose-app-ui'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useMediaQuery } from 'react-responsive'

export const Layout: FC<PropsWithChildren> = () => {
  const isHomePage = useMatch('/wrap')
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1023px)' })

  return (
    <LayoutBase
      header={
        <Header
          navLink={
            !isHomePage && (
              <NavLink
                className={classes.headerLink}
                to="/stake/dashboard"
                style={{ visibility: isHomePage ? 'hidden' : 'visible' }}
              >
                <h2 className={classes.header}>
                  ROSE <LogoIcon /> wrapper
                </h2>
              </NavLink>
            )
          }
        >
          {isHomePage && <div />}
          {!isHomePage && !isMobileScreen && <ConnectButton />}
        </Header>
      }
    >
      <main className={classes.main}>
        <Outlet />
      </main>
    </LayoutBase>
  )
}
