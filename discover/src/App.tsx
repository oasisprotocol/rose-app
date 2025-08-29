import { FC } from 'react'
import { Layout, Card } from '@oasisprotocol/rose-app-ui/discover'
import { CARDS_CONFIG } from './constants/config'
import classes from './App.module.css'

const { featured, dApps, tooling } = CARDS_CONFIG

export const App: FC = () => {
  return (
    <Layout>
      <div className={classes.app}>
        <h1 className={classes.discoverTitle}>Discover</h1>
        <div className={classes.featured}>
          {featured.map(cardConfig => (
            <Card isFeatured key={cardConfig.title} {...cardConfig} />
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
    </Layout>
  )
}
