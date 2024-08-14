import { FC, PropsWithChildren } from 'react'
import { StringUtils } from '../../utils/string.utils'
import classes from './index.module.css'

export const Tabs: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => {
  return <ul className={StringUtils.clsx(classes.tabs, className)}>{children}</ul>
}
