import { FC, ReactElement } from 'react'
import { StringUtils } from '../../utils/string.utils'
import classes from './index.module.css'

interface Props {
  title: string
  description: string
  icon: ReactElement
}

export const InfoCard: FC<Props> = ({ title, description, icon }) => {
  return (
    <div className={classes.card}>
      <div className={classes.iconWrapper}>{icon}</div>
      <div>
        <h3 className={classes.title}>{title}</h3>
        <p className={StringUtils.clsx('body', classes.description)}>{description}</p>
      </div>
    </div>
  )
}
