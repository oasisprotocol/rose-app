import { FC } from 'react'
import classes from './index.module.css'
import { LogoIcon } from '../../components/icons/LogoIcon'
import { StringUtils } from '../../utils/string.utils'
import { ConnectWallet } from '../../components/ConnectWallet'
import { SearchIcon } from '../../components/icons/SearchIcon'
import { TokenIcon } from '../../components/icons/TokenIcon'
import { MenuBookIcon } from '../../components/icons/MenuBookIcon'
import {
  OASIS_DOCS_PAGE_URL,
  OASIS_EXPLORER_SAPPHIRE_MAINNET_PAGE_URL,
  OASIS_HOME_PAGE_TOKENOMICS_URL,
} from '../../constants/config'
import { InfoCard } from '../../components/InfoCard'
import { useWeb3 } from '../../hooks/useWeb3'
import { withConnectedWallet } from '../../hoc/withConnectedWallet'
import { useAppState } from '../../hooks/useAppState'

const HomePageCmp: FC = () => {
  const {
    state: { nativeCurrency },
  } = useWeb3()
  const {
    state: { isDesktopScreen },
  } = useAppState()

  return (
    <div className={classes.homePage}>
      <LogoIcon className={classes.logo} size={isDesktopScreen ? 'large' : 'medium'} />
      <p className={StringUtils.clsx('body', classes.description)}>
        Easily stake {nativeCurrency?.symbol} tokens on Sapphire using our ROSE stake dApp and help the
        network. By staking you help the ecosystem’s network security and earn rewards at the same time.
      </p>
      <div className={classes.connectWallet}>
        <ConnectWallet inline />
      </div>
      <p className={StringUtils.clsx('body', classes.discoverMore)}>
        Discover more info through the info cards below
      </p>

      <div className={classes.infoBoxes}>
        <a href={OASIS_EXPLORER_SAPPHIRE_MAINNET_PAGE_URL} rel="noopener noreferrer" target="_blank">
          <InfoCard
            title="Open Oasis Explorer"
            description="Discover our network activity"
            icon={<SearchIcon width={20} />}
          />
        </a>
        <a href={OASIS_HOME_PAGE_TOKENOMICS_URL} rel="noopener noreferrer" target="_blank">
          <InfoCard
            title="Our Tokenomics"
            description="More info on our ROSE token"
            icon={<TokenIcon width={24} />}
          />
        </a>
        <a href={OASIS_DOCS_PAGE_URL} rel="noopener noreferrer" target="_blank">
          <InfoCard
            title="Oasis Docs"
            description="Explore our documentation"
            icon={<MenuBookIcon width={22} />}
          />
        </a>
      </div>
    </div>
  )
}

export const HomePage = withConnectedWallet(HomePageCmp)
