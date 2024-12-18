import { FC, PropsWithChildren, ReactNode } from 'react'
import { DateUtils } from '../../utils/date.utils'
import { useMediaQuery } from 'react-responsive'
import classes from './index.module.css'
import globalClasses from '../../index.module.css'
import { StringUtils } from '../../utils'

interface Props {
  header?: ReactNode
}

export const LayoutBase: FC<PropsWithChildren<Props>> = ({ children, header }) => {
  const ltLargeScreen = useMediaQuery({ query: '(max-width: 1280px)' })

  return (
    <div className={StringUtils.clsx(globalClasses.global, classes.layout)}>
      {header}
      <main className={classes.main}>{children}</main>
      {!ltLargeScreen && (
        <footer className={classes.footer}>
          <div className={classes.footerColumn}>
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
                ) built at{' '}
                {DateUtils.intlDateFormat(BUILD_DATETIME, {
                  format: ltLargeScreen ? 'short' : 'long',
                })}
              </div>
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

      {ltLargeScreen && (
        <footer className={classes.mobileFooter}>
          <div className={classes.footerRow}>
            <span className="small">
              <div>
                Version: {APP_VERSION} (commit:{' '}
                <a
                  className={classes.mobileLink}
                  href={`${GITHUB_REPOSITORY_URL}commit/${BUILD_COMMIT}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {BUILD_COMMIT.substring(0, 7)}
                </a>
                ) built at{' '}
                {DateUtils.intlDateFormat(BUILD_DATETIME, {
                  format: ltLargeScreen ? 'short' : 'long',
                })}
              </div>
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
