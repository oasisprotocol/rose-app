import { FC } from 'react'
import classes from './index.module.css'
import { cn } from '@oasisprotocol/ui-library/src'

export interface CardConfig {
  title: string
  type?: string
  description?: string
  imgSrc: string
  externalLink: string
}

interface Props extends CardConfig {
  className?: string
  isFeatured?: boolean
  isHero?: boolean
}

export const Card: FC<Props> = ({
  externalLink,
  title,
  imgSrc,
  type,
  description,
  className,
  isFeatured,
  isHero,
}) => (
  <a className={classes.externalLink} href={externalLink} rel="noopener noreferrer" target="_blank">
    <div
      className={`${classes.card} ${isFeatured ? classes.isFeatured : ''} ${className}`}
      style={isFeatured ? { backgroundImage: `url(${imgSrc})` } : undefined}
    >
      {isFeatured && type && <p className={cn(classes.typeOnTop, 'text-tiny regular')}>{type}</p>}
      {!isFeatured && (
        <div className={classes.thumbnail}>
          <img src={imgSrc} alt={title} />
        </div>
      )}
      <div className={classes.description}>
        <p className={isFeatured ? (isHero ? 'text-xxxl medium' : 'text-xxl medium') : 'text-base medium'}>
          {title}
        </p>
        {!isFeatured && type && <p className={cn(classes.type, 'text-sm regular')}>{type}</p>}
        {!!isFeatured && description && (
          <p className={'text-sm regular w-[320px] text-[var(--zinc-500)]'}>{description}</p>
        )}
      </div>
    </div>
  </a>
)
