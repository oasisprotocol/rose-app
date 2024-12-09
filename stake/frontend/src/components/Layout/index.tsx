import { FC } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import classes from './index.module.css'
import { LogoIcon } from '../icons/LogoIcon'
import { Alert } from '../Alert'
import { useAppState } from '../../hooks/useAppState'
import { Button } from '../Button'
import { StringUtils } from '../../utils/string.utils'
import { LayoutBase } from '../LayoutBase'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Sidebar } from '../../../../../src/components/Sidebar'

export const Layout: FC = () => {
  const isHomePage = useMatch('/')
  const {
    state: { appError, isDesktopScreen },
    clearAppError,
  } = useAppState()

  return (
    <Sidebar
      navItem={
        <>
          <hr />{' '}
          <div className={classes.mobileSidebarAccount}>
            <ConnectButton accountStatus="full" chainStatus="full" showBalance />
          </div>
        </>
      }
    >
      <LayoutBase
        header={
          <header className={classes.header}>
            <NavLink
              className={classes.headerLink}
              to="/dashboard"
              style={{ visibility: isHomePage ? 'hidden' : 'visible' }}
            >
              <LogoIcon />
            </NavLink>
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
    </Sidebar>
  )
}
