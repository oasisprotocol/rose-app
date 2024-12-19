import { FC, PropsWithChildren, ReactNode } from 'react'
import classes from './index.module.css'
import globalClasses from '../../index.module.css'

interface Props {
  header?: ReactNode
}

export const Layout: FC<PropsWithChildren<Props>> = ({ children }) => {
  return (
    <div className={`${globalClasses.global} ${classes.layout}`}>
      <main className={classes.main}>{children}</main>
    </div>
  )
}
