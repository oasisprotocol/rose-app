import symbol_warning_svg from '/move/symbol_warning.svg?url'
import { useIsRpcResponding } from '../../utils/useIsRpcResponding'
import { MoveLayoutBase as LayoutBase } from '@oasisprotocol/rose-app-ui/move'
import classes from './index.module.css'

export function Layout(props: { header: React.ReactNode; children: React.ReactNode }) {
  const isRpcResponding = useIsRpcResponding()

  return (
    <LayoutBase
      header={
        <>
          {!['https://rose.oasis.io', 'https://rose.prd.oasis.io'].includes(window.location.origin) && (
            <div className="warningNotification" style={{ margin: '0 auto' }}>
              <img src={symbol_warning_svg} alt="Warning" width="24" />
              <p>Please note this is not production deploy.</p>
            </div>
          )}
          {!isRpcResponding && (
            <div
              className="warningNotification"
              style={{
                position: 'sticky',
                zIndex: 999,
                top: '10px',
                margin: '0 auto',
              }}
            >
              <img src={symbol_warning_svg} alt="Warning" width="24" />
              <p>
                Services are currently interrupted.{' '}
                <a href="https://status.oasis.io/" target="_blank" rel="noopener noreferrer">
                  Click here
                </a>{' '}
                for more details.
              </p>
            </div>
          )}
          {props.header}
        </>
      }
    >
      <section className={classes.mainSection}>{props.children}</section>
    </LayoutBase>
  )
}
