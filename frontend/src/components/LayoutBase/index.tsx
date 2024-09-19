import { FC, PropsWithChildren, ReactNode } from 'react'
import classes from './index.module.css'
import {
  GITHUB_REPOSITORY_URL,
  OASIS_DOCS_PAGE_URL,
  OASIS_HOME_PAGE_URL,
  VITE_APP_VERSION,
  VITE_REACT_APP_BUILD_DATETIME,
  VITE_REACT_APP_BUILD_VERSION,
} from '../../constants/config'
import { DateUtils } from '../../utils/date.utils'
import { useMediaQuery } from 'react-responsive'

interface Props {
  header?: ReactNode
}

export const LayoutBase: FC<PropsWithChildren<Props>> = ({ children, header }) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 1000px)' })

  return (
    <div className={classes.layout}>
      {header}
      <main className={classes.main}>{children}</main>
      {!isMobileScreen && (
        <footer className={classes.footer}>
          <div className={classes.footerColumn}>
            <span>
              {VITE_REACT_APP_BUILD_VERSION && VITE_REACT_APP_BUILD_DATETIME && (
                <div>
                  Version: {VITE_APP_VERSION} (commit:{' '}
                  <a
                    href={`${GITHUB_REPOSITORY_URL}commit/${VITE_REACT_APP_BUILD_VERSION}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {VITE_REACT_APP_BUILD_VERSION.substring(0, 7)}
                  </a>
                  ) built at{' '}
                  {DateUtils.intlDateFormat(VITE_REACT_APP_BUILD_DATETIME, {
                    format: isMobileScreen ? 'short' : 'long',
                  })}
                </div>
              )}
            </span>
            <span>|</span>
            <span>
              <a href={OASIS_DOCS_PAGE_URL} rel="noopener noreferrer" target="_blank">
                API Documentation
              </a>
            </span>
            <span>
              <a href={GITHUB_REPOSITORY_URL} rel="noopener noreferrer" target="_blank">
                GitHub
              </a>
            </span>
          </div>
          <div className={classes.footerColumn}>
            <a href={OASIS_HOME_PAGE_URL} rel="noopener noreferrer" target="_blank">
              Oasis Protocol Foundation | 2024
            </a>
          </div>
        </footer>
      )}

      {isMobileScreen && (
        <footer className={classes.mobileFooter}>
          <div className={classes.footerRow}>
            <span className="small">
              {VITE_REACT_APP_BUILD_VERSION && VITE_REACT_APP_BUILD_DATETIME && (
                <div>
                  Version: {VITE_APP_VERSION} (commit:{' '}
                  <a
                    className={classes.mobileLink}
                    href={`${GITHUB_REPOSITORY_URL}commit/${VITE_REACT_APP_BUILD_VERSION}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {VITE_REACT_APP_BUILD_VERSION.substring(0, 7)}
                  </a>
                  ) built at{' '}
                  {DateUtils.intlDateFormat(VITE_REACT_APP_BUILD_DATETIME, {
                    format: isMobileScreen ? 'short' : 'long',
                  })}
                </div>
              )}
            </span>
          </div>
          <div className={classes.footerRow}>
            <span className="small">
              <a
                className={classes.mobileLink}
                href={OASIS_DOCS_PAGE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                API Documentation
              </a>
            </span>
            &nbsp;
            <span className="small">
              <a
                className={classes.mobileLink}
                href={GITHUB_REPOSITORY_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </span>
            <span>&nbsp;|&nbsp;</span>
            <span className="small">
              <a
                className={classes.mobileLink}
                href={OASIS_HOME_PAGE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                Oasis Protocol Foundation | 2024
              </a>
            </span>
          </div>
        </footer>
      )}
    </div>
  )
}
