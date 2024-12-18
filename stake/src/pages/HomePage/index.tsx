import { FC } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import {
  InfoCard,
  LogoIcon,
  MenuBookIcon,
  SearchIcon,
  StringUtils,
  TokenIcon,
} from '@oasisprotocol/rose-app-ui/stake'
import {
  OASIS_EXPLORER_SAPPHIRE_MAINNET_PAGE_URL,
  OASIS_HOME_PAGE_TOKENOMICS_URL,
} from '../../constants/config'
import { withConnectedWallet } from '../../hoc/withConnectedWallet'
import classes from './index.module.css'

const HomePageCmp: FC = () => {
  return (
    <div className={classes.homePage}>
      <LogoIcon className={classes.logo} />
      <p className={StringUtils.clsx('body', classes.description)}>
        Earn rewards by staking your ROSE directly from Sapphire.
      </p>
      <div className={classes.connectWallet}>
        <ConnectButton />
      </div>
      <p className={StringUtils.clsx('body', classes.discoverMore)}>
        Discover more info through the info cards below
      </p>

      <div className={classes.infoBoxes}>
        <a href={OASIS_EXPLORER_SAPPHIRE_MAINNET_PAGE_URL} rel="noopener noreferrer" target="_blank">
          <InfoCard
            title="Open Oasis Explorer"
            description="Discover network activity"
            icon={<SearchIcon width={20} />}
          />
        </a>
        <a href={OASIS_HOME_PAGE_TOKENOMICS_URL} rel="noopener noreferrer" target="_blank">
          <InfoCard
            title="Our Tokenomics"
            description="More info about ROSE"
            icon={<TokenIcon width={24} />}
          />
        </a>
        <a href={OASIS_DOCS_PAGE_URL} rel="noopener noreferrer" target="_blank">
          <InfoCard
            title="Oasis Docs"
            description="Read the documentation"
            icon={<MenuBookIcon width={22} />}
          />
        </a>
      </div>
    </div>
  )
}

export const HomePage = withConnectedWallet(HomePageCmp)
