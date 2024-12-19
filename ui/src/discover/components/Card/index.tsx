import { FC, ReactNode } from 'react'
import { Coins } from 'lucide-react'
import { CardConfig, CardConfigLabel } from '../../types'
import classes from './index.module.css'

interface Props extends CardConfig {
  className?: string
  isFeatured?: boolean
}

const cardConfigLabelMap: { [key in CardConfigLabel]: (isFeatured?: boolean) => ReactNode } = {
  [CardConfigLabel.Grant]: isFeatured => (
    <p className={`${classes.grantRecipient} text-sm ${isFeatured ? 'medium' : 'regular'}`}>
      <Coins size={13.33} />
      &nbsp; Grant Recipient
    </p>
  ),
}

export const Card: FC<Props> = ({ externalLink, labels, title, imgSrc, type, className, isFeatured }) => {
  const label = labels?.length ? cardConfigLabelMap[labels[0]](isFeatured) : null

  return (
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
          {label}
          {type && (
            <p className={`${classes.type} text-sm regular`}>
              {isFeatured && label ? <span>&nbsp;•&nbsp;</span> : null}
              {type}
            </p>
          )}
        </div>
      </div>
    </a>
  )
}
