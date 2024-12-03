import { FC, MouseEvent, PropsWithChildren, ReactNode } from 'react'
import classes from './index.module.css'
import { StringUtils } from '../../utils/string.utils'
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon'

interface Props extends PropsWithChildren {
  header?: ReactNode
  className?: string
  hasBackButton?: boolean
  onBackButtonClick?: (e?: MouseEvent<HTMLElement>) => void
}

export const Card: FC<Props> = ({ children, header, className, hasBackButton, onBackButtonClick }) => {
  return (
    <div className={StringUtils.clsx(classes.card, className)}>
      {header ? (
        <div className={classes.cardHeader}>
          {hasBackButton ? (
            <button className={classes.backButton} onClick={e => onBackButtonClick?.(e)}>
              <ArrowLeftIcon />
            </button>
          ) : null}
          {header}
        </div>
      ) : null}
      {children}
    </div>
  )
}
