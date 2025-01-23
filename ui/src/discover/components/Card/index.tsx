import { FC } from 'react'
import { CardConfig } from '../../types'
import classes from './index.module.css'

interface Props extends CardConfig {
  className?: string
  isFeatured?: boolean
}

export const Card: FC<Props> = ({ externalLink, title, imgSrc, type, className, isFeatured }) => (
  <a className={classes.externalLink} href={externalLink} rel="noopener noreferrer" target="_blank">
    <div
      className={`${classes.card} ${isFeatured ? classes.isFeatured : ''} ${className}`}
      style={isFeatured ? { backgroundImage: `url(${imgSrc})` } : undefined}
    >
      {!isFeatured && (
        <div className={classes.thumbnail}>
          <img src={imgSrc} alt={title} />
        </div>
      )}
      <div className={classes.description}>
        <p className={isFeatured ? 'text-xl medium' : 'text-base medium'}>{title}</p>
        {type && <p className={`${classes.type} text-sm regular`}>{type}</p>}
      </div>
    </div>
  </a>
)
