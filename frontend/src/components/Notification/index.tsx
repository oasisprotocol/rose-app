import { FC, PropsWithChildren } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'

interface Props {
  small?: boolean
}

export const Notification: FC<PropsWithChildren<Props>> = ({ children, small }) => {
  return (
    <span className={StringUtils.clsx(classes.notification, small ? classes.small : undefined)}>
      {children}
    </span>
  )
}
