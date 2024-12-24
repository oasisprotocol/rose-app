import { FC } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import classes from './index.module.css'
import { Alert, Button, LayoutBase, LogoIcon, StringUtils } from '@oasisprotocol/rose-app-ui/stake'
import { useAppState } from '../../hooks/useAppState'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Header } from '@oasisprotocol/rose-app-ui/core'

export const Layout: FC = () => {
  const isHomePage = useMatch('/stake')
  const {
    state: { appError, isDesktopScreen },
    clearAppError,
  } = useAppState()

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
                <LogoIcon />
              </NavLink>
            )
          }
        >
          {isHomePage && <div />}
          {!isHomePage && isDesktopScreen && <ConnectButton />}
        </Header>
      }
    >
      <section className={classes.mainSection}>
        {appError && (
          <Alert
            type="error"
            actions={
              <Button variant="text" onClick={clearAppError}>
                &lt; Go back&nbsp;
              </Button>
            }
          >
            {StringUtils.truncate(appError)}
          </Alert>
        )}
        {!appError && <Outlet />}
      </section>
    </LayoutBase>
  )
}
