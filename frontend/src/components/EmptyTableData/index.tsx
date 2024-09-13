import { FC, PropsWithChildren } from 'react'
import classes from './index.module.css'
import { BlockIcon } from '../icons/BlockIcon'

export const EmptyTableData: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className={classes.emptyTableData}>
      <BlockIcon width={40} height={40} />
      {children}
    </div>
  )
}
