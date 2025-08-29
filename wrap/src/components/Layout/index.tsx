import { FC, PropsWithChildren } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { WrapLogoIcon } from '../Logo/WrapLogoIcon'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useMediaQuery } from 'react-responsive'
import classes from './index.module.css'
import { Header } from '@oasisprotocol/rose-app-ui/core'
import { cn } from '@oasisprotocol/ui-library/src'

const dateFormatLong = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

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
      <footer className={classes.footer}>
        <span>
          <div>
            Version: {APP_VERSION} (commit:{' '}
            <a
              href={`${GITHUB_REPOSITORY_URL}commit/${BUILD_COMMIT}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {BUILD_COMMIT.substring(0, 7)}
            </a>
            ) built at {dateFormatLong.format(BUILD_DATETIME)}
          </div>
        </span>
        <span>|</span>
        <span style={{ flexGrow: 1 }}>
          <a href={GITHUB_REPOSITORY_URL} rel="noopener noreferrer" target="_blank">
            GitHub
          </a>
        </span>
        <span>
          <a href={OASIS_HOME_PAGE_URL} rel="noopener noreferrer" target="_blank">
            Oasis Protocol Foundation | 2024
          </a>
        </span>
      </footer>
    </div>
  )
}
