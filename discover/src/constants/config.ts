import { CardConfig } from '@oasisprotocol/rose-app-ui/discover'

export const CARDS_CONFIG: { featured: CardConfig[]; dApps: CardConfig[]; tooling: CardConfig[] } = {
  featured: [
    {
      title: 'ROFL App',
      type: 'TOOLING',
      description:
        'Build trustless apps. Start quickly with templates. Manage everything from one interface.',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/RoflApp.jpg',
      externalLink: 'https://rofl.app',
    },
    {
      title: 'Accumulated Finance',
      type: 'LIQUID STAKING',
      description:
        'Omnichain liquid staking protocol. Lending of liquid staked tokens (LSTs). Leveraged staking.',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/AccumulatedFinance.png',
      externalLink: 'https://accumulated.finance/',
    },
    {
      title: 'Bit Protocol',
      type: 'CDP STABLECOIN',
      description: 'The first privacy-focused stablecoin built on Oasis Sapphire EVM.',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/BitProtocol.png',
      externalLink: 'https://bitusd.finance/',
    },
  ],
  dApps: [
    {
      title: 'Thorn Protocol',
      type: 'StableSwap',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/ThornProtocol.jpg',
      externalLink: 'https://thornprotocol.com/',
    },
    {
      title: 'Oasis Blockvote',
      type: 'Governance',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/OasisBlockvote.svg',
      externalLink: 'https://vote.oasis.io/',
    },
    {
      title: 'Rosy',
      type: 'Meme',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Rosy.jpg',
      externalLink: 'https://rosytoken.com/',
    },
    {
      title: "Rakesh's Village",
      type: 'Meme & Token Minter',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/RakeshsVillage.jpg',
      externalLink: 'https://www.rakeshvillage.fun/',
    },
    {
      title: 'Predictoor',
      type: 'Predictions',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Predictoor.jpg',
      externalLink: 'https://www.predictoor.ai/',
    },
    {
      title: 'Pixel Realm',
      type: 'NFT Marketplace & Gaming Incubator',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/PixelRealm.jpg',
      externalLink: 'https://app.pixelrealm.io/',
    },
    {
      title: 'Pixudi',
      type: 'Gaming',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Pixudi.webp',
      externalLink: 'https://pixudi.com/',
    },
    {
      title: 'Oasis Safe',
      type: 'Multisig Wallet',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/OasisSafe.svg',
      externalLink: 'https://safe.oasis.io/welcome',
    },
    {
      title: 'Midas',
      type: 'RWA Yield',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Midas.jpg',
      externalLink: 'https://midas.app/',
    },
    {
      title: 'Daosis',
      type: 'Launchpad & Token Minter',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Daosis.jpg',
      externalLink: 'https://daosis.io/',
    },
    {
      title: 'NEBY',
      type: 'DEX',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Neby.jpg',
      externalLink: 'https://www.neby.exchange/',
    },
  ],
  tooling: [
    {
      title: 'Empyreal / Simulacrum',
      type: 'SDK & AI Agents',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Empyreal.jpg',
      externalLink: 'https://empyrealsdk.com/',
    },
    {
      title: 'Router Bridge',
      type: 'Bridge',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Router.jpg',
      externalLink: 'https://app.routernitro.com/swap',
    },
    {
      title: 'DEX Screener',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/DexScreener.jpg',
      externalLink: 'https://dexscreener.com/oasissapphire',
    },
    {
      title: 'DappRadar',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/DappRadar.jpg',
      externalLink: 'https://dappradar.com/rankings/protocol/oasis-sapphire',
    },
    {
      title: 'DefiLlama',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/DefiLlama.jpg',
      externalLink: 'https://defillama.com/chain/Oasis%20Sapphire',
    },
    {
      title: 'ROSE Wallet',
      type: 'Wallet',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/RoseWallet.svg',
      externalLink: 'https://wallet.oasis.io/',
    },
    {
      title: 'illuminex',
      type: 'Privacy Wallet',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/illumineX.jpg',
      externalLink: 'https://illuminex.xyz/',
    },
    {
      title: 'Oasis Explorer',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/OasisExplorer.svg',
      externalLink: 'https://explorer.oasis.io/',
    },
    {
      title: 'Oasis Docs',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/OasisDocs.svg',
      externalLink: 'https://docs.oasis.io/',
    },
    {
      title: 'CoinMarketCap',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/CoinMarketCap.jpg',
      externalLink: 'https://coinmarketcap.com/currencies/oasis-network/',
    },
    {
      title: 'CoinGecko',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Coingecko.jpg',
      externalLink: 'https://www.coingecko.com/en/coins/oasis',
    },
    {
      title: 'Reclaim Protocol',
      type: 'SDK',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/ReclaimProtocol.svg',
      externalLink: 'https://www.reclaimprotocol.org/',
    },
    {
      title: 'RA1L',
      type: 'DID',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/Ra1l.jpg',
      externalLink: 'https://ra1l.com/',
    },
    {
      title: 'OWallet',
      type: 'Wallet',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/OWallet.jpg',
      externalLink: 'https://owallet.io/',
    },
    {
      title: 'Safepal',
      type: 'Wallet',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/SafePal.png',
      externalLink: 'https://safepal.com/en/',
    },
    {
      title: 'StealthEX',
      type: 'Exchange',
      imgSrc: 'https://assets.oasis.io/rose-app-discover/StealthEX.svg',
      externalLink: 'https://stealthex.io/?to=rose',
    },
  ],
}
