import { FC } from 'react'
import classes from './index.module.css'
import { LoadingIcon } from '../icons/LoadingIcon'

export const LoadingTableData: FC = () => {
  return (
    <div className={classes.loadingTableData}>
      <LoadingIcon width={40} height={40} />
    </div>
  )
}
