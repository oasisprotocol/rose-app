import { defineChain } from "viem";

const sapphire = defineChain({
    id: 0x5afe,
    name: 'Sapphire',
    network: 'sapphire',
    nativeCurrency: { name: 'ROSE', symbol: 'ROSE', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://sapphire.oasis.io'],
        webSocket: ['wss://sapphire.oasis.io/ws']
      },
      public: {
        http: ['https://sapphire.oasis.io'],
        webSocket: ['wss://sapphire.oasis.io/ws']
      },
    },
    blockExplorers: {
      default: {
        name: 'Sapphire Explorer',
        url: 'https://explorer.oasis.io/mainnet/sapphire/',
      },
    }
});

const sapphireTestnet = defineChain({
  id: 0x5aff,
  name: 'Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: { name: 'TEST', symbol: 'TEST', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.dev'],
      webSocket: ['wss://testnet.sapphire.oasis.dev/ws']
    },
    public: {
      http: ['https://testnet.sapphire.oasis.dev'],
      webSocket: ['wss://testnet.sapphire.oasis.dev/ws']
    },
  },
  blockExplorers: {
    default: {
      name: 'Sapphire Explorer',
      url: 'https://explorer.oasis.io/testnet/sapphire/',
    },
  }
});

const sapphireLocalnet = defineChain({
  id: 0x5afd,
  name: 'Sapphire Localnet',
  network: 'sapphire-localnet',
  nativeCurrency: { name: 'TEST', symbol: 'TEST', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  }
});

import { configureChains, createConfig } from 'wagmi';

import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
    [
      sapphire,
      sapphireTestnet,
      sapphireLocalnet
    ],
    [publicProvider()]
);

import { braveWallet, injectedWallet, metaMaskWallet, safeWallet } from '@rainbow-me/rainbowkit/wallets';

import { connectorsForWallets, WalletList } from '@rainbow-me/rainbowkit';

const wallets: WalletList = [
    {
        groupName: 'Popular',
        wallets: [
          injectedWallet({ chains }),
          safeWallet({chains}),
          metaMaskWallet({projectId: '', chains}),
          braveWallet({chains})
        ]
    }
];

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: connectorsForWallets(wallets),
    publicClient
});


export { chains, wagmiConfig };