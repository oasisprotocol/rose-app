import { FC, ReactNode } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'

interface Props {
  className?: string
  content: [ReactNode, ReactNode][]
}

export const PreviewTable: FC<Props> = ({ content, className }) => {
  return (
    <div className={StringUtils.clsx(className, classes.previewTable)}>
      {content.map(([label, value], index) => (
        <div key={index} className={classes.row}>
          <div className={classes.col}>{label}</div>
          <div className={classes.col}>{value}</div>
        </div>
      ))}
    </div>
  )
}
