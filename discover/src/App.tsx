import { FC } from 'react'
import { cn } from '@oasisprotocol/ui-library/src'
import { Card } from './Card'
import { CARDS_CONFIG } from './constants/config'
import classes from './App.module.css'

const { featured, dApps, tooling } = CARDS_CONFIG

export const App: FC = () => {
  return (
    <div className={cn(classes.global, classes.app)}>
      <div className={classes.featured}>
        {featured.map((cardConfig, index) => (
          <Card isFeatured isHero={index === 0} key={cardConfig.title} {...cardConfig} />
        ))}
      </div>
      <h2 className={classes.dAppsTitle}>dApps</h2>
      <div className={classes.dApps}>
        {dApps.map(cardConfig => (
          <Card key={cardConfig.title} {...cardConfig} />
        ))}
      </div>
      <h2 className={classes.toolingTitle}>Tooling</h2>
      <div className={classes.tooling}>
        {tooling.map(cardConfig => (
          <Card key={cardConfig.title} {...cardConfig} />
        ))}
      </div>
    </div>
  )
}
