import { FC } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import classes from './index.module.css'
import { LogoIcon } from '../icons/LogoIcon'
import { ConnectWallet } from '../ConnectWallet'
import { Alert } from '../Alert'
import { useAppState } from '../../hooks/useAppState'
import { Button } from '../Button'
import { StringUtils } from '../../utils/string.utils'
import { LayoutBase } from '../LayoutBase'
import { OasisIcon } from '../icons/OasisIcon'

export const Layout: FC = () => {
  const isHomePage = useMatch('/')
  const {
    state: { appError },
    clearAppError,
  } = useAppState()

  return (
    <LayoutBase
      header={
        <header className={classes.header}>
          <NavLink to="/dashboard">{isHomePage ? <OasisIcon /> : <LogoIcon />}</NavLink>
          {!isHomePage && <ConnectWallet />}
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
