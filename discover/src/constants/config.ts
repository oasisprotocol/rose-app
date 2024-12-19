/**
 * Copyright 2024
 * SPDX-License-Identifier: CC BY
 */

import { CardConfig, CardConfigLabel } from '@oasisprotocol/rose-app-ui/discover'

export const CARDS_CONFIG: { featured: CardConfig[]; dApps: CardConfig[]; tooling: CardConfig[] } = {
  featured: [
    {
      title: 'Neby',
      type: 'DEX',
      imgSrc: '/discover/Neby.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://www.neby.exchange/',
    },
    {
      title: 'Accumulated Finance',
      type: 'Liquid staking',
      imgSrc: '/discover/AccumulatedFinance.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://accumulated.finance/',
    },
    {
      title: 'BitProtocol',
      type: 'CDP Stablecoin',
      imgSrc: '/discover/BitProtocol.jpg',
      externalLink: 'https://bitusd.finance/',
    },
  ],
  dApps: [
    {
      title: 'Thorn',
      type: 'StableSwap',
      imgSrc: '/discover/ThornProtocol.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://thornprotocol.com/',
    },
    {
      title: 'Daosis',
      type: 'Launchpad & Token Minter',
      imgSrc: '/discover/Daosis.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://daosis.io/',
    },
    {
      title: 'Rosy',
      type: 'Meme',
      imgSrc: '/discover/Rosy.jpg',
      externalLink: 'https://daosis.io/',
    },
    {
      title: '4P SuperdApp',
      type: 'Web3 Messenger',
      imgSrc: '/discover/4PSuperdApp.jpg',
      externalLink: 'https://the4thpillar.io/',
    },
    {
      title: "Rakesh's Village",
      type: 'Meme & Token Minter',
      imgSrc: '/discover/RakeshsVillage.jpg',
      externalLink: 'https://www.rakeshvillage.fun/',
    },
    {
      title: 'Predictoor',
      type: 'Predictions',
      imgSrc: '/discover/Predictoor.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://www.predictoor.ai/',
    },
    {
      title: 'Pixelrealm',
      type: 'NFT Marketplace & Gaming Incubator',
      imgSrc: '/discover/PixelRealm.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://app.pixelrealm.io/',
    },
    {
      title: 'Protocol Monster Labs',
      type: 'Gaming',
      imgSrc: '/discover/ProtocolMonsterLabs.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://protocolmonsterlabs.com/',
    },
    {
      title: 'Oasis Safe',
      type: 'Multisig Wallet',
      imgSrc: '/discover/OasisSafe.svg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://safe.oasis.io/welcome',
    },
    {
      title: 'Midas',
      type: 'RWA Yield',
      imgSrc: '/discover/Midas.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://midas.app/',
    },
  ],
  tooling: [
    {
      title: 'Empyreal / Simulacrum',
      type: 'SDK & AI Agents',
      imgSrc: '/discover/Empyreal.jpg',
      externalLink: 'https://empyrealsdk.com/',
    },
    {
      title: 'Router Bridge',
      type: 'Bridge',
      imgSrc: '/discover/Router.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://app.routernitro.com/swap',
    },
    {
      title: 'Dexscreener',
      imgSrc: '/discover/DexScreener.jpg',
      externalLink: 'https://dexscreener.com/oasissapphire',
    },
    {
      title: 'Dappradar',
      imgSrc: '/discover/DappRadar.jpg',
      externalLink: 'https://dappradar.com/rankings/protocol/oasis-sapphire',
    },
    {
      title: 'DefiLlama',
      imgSrc: '/discover/DefiLlama.jpg',
      externalLink: 'https://defillama.com/chain/Oasis%20Sapphire',
    },
    {
      title: 'Rose wallet',
      type: 'Wallet',
      imgSrc: '/discover/RoseWalletWhite.png',
      externalLink: 'https://wallet.oasis.io/',
    },
    {
      title: 'Illuminex',
      type: 'Privacy Wallet',
      imgSrc: '/discover/illumineX.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://illuminex.xyz/',
    },
    {
      title: 'Explorer',
      imgSrc: '/discover/OasisExploreWhite.png',
      externalLink: 'https://explorer.oasis.io/',
    },
    {
      title: 'Docs',
      imgSrc: '/discover/OasisDocsWhite.png',
      externalLink: 'https://docs.oasis.io/',
    },
    {
      title: 'Transak',
      imgSrc: '/discover/Transak.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://global.transak.com/',
    },
    {
      title: 'CoinMarketCap',
      imgSrc: '/discover/CoinMarketCap.jpg',
      externalLink: 'https://coinmarketcap.com/currencies/oasis-network/',
    },
    {
      title: 'CoinGecko',
      imgSrc: '/discover/Coingecko.jpg',
      externalLink: 'https://www.coingecko.com/en/coins/oasis',
    },
    {
      title: 'Reclaim Protocol',
      type: 'SDK',
      imgSrc: '/discover/ReclaimProtocol.svg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://www.reclaimprotocol.org/',
    },
    {
      title: 'Ra1l',
      type: 'DID',
      imgSrc: '/discover/Ra1l.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://ra1l.com/',
    },
    {
      title: 'OWallet',
      type: 'Wallet',
      imgSrc: '/discover/OWallet.jpg',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://owallet.io/',
    },
    {
      title: 'Safepal',
      type: 'Wallet',
      imgSrc: '/discover/SafePal.png',
      labels: [CardConfigLabel.Grant],
      externalLink: 'https://safepal.com/en/',
    },
  ],
}
