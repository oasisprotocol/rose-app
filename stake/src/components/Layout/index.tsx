import { FC } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import classes from './index.module.css'
import { LogoIcon, Alert, Button, LayoutBase, StringUtils } from '@oasisprotocol/rose-app-ui/stake'
import { useAppState } from '../../hooks/useAppState'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Layout: FC = () => {
  const isHomePage = useMatch('/stake')
  const {
    state: { appError, isMobileScreen, isDesktopScreen },
    clearAppError,
  } = useAppState()

  return (
    <LayoutBase
      header={
        <header className={classes.header}>
          {!isHomePage && (
            <NavLink
              className={classes.headerLink}
              to="/stake/dashboard"
              style={{ visibility: isHomePage ? 'hidden' : 'visible' }}
            >
              <LogoIcon isMobileScreen={isMobileScreen} />
            </NavLink>
          )}
          {!isHomePage && isDesktopScreen && <ConnectButton />}
        </header>
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
