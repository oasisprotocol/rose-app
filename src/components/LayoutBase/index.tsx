import { FC, PropsWithChildren, ReactNode } from 'react'
import classes from './index.module.css'

interface Props {
  header?: ReactNode
}

const dateFormatLong = new Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
})

export const LayoutBase: FC<PropsWithChildren<Props>> = ({ children, header }) => {
  return (
    <div className={classes.layout}>
      {header}
      {window.location.origin !== 'https://onramp.oasis.io' && (
        <p style={{ textAlign: 'center', color: 'orange' }}>
          Please note this is not production deploy. Final version will generate different accounts.
        </p>
      )}
      <main className={classes.main}>{children}</main>
      <footer className={classes.footer}>
        <div className={classes.footerColumn}>
          <span>
            <div>
              Version: {APP_VERSION} (commit:{' '}
              <a href={`${GITHUB_REPOSITORY_URL}commit/${BUILD_COMMIT}`} rel="noopener noreferrer" target="_blank">
                {BUILD_COMMIT.substring(0, 7)}
              </a>
              ) built at {dateFormatLong.format(BUILD_DATETIME)}
            </div>
          </span>
          <span>|</span>
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
    </div>
  )
}
