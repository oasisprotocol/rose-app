import { Chain, defineChain } from 'viem'

export const SAPPHIRE_CHAIN_CONFIG = defineChain({
  id: 23294,
  name: 'Oasis Sapphire',
  network: 'sapphire',
  nativeCurrency: { name: 'Sapphire Rose', symbol: 'ROSE', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://sapphire.oasis.io'],
      webSocket: ['wss://sapphire.oasis.io/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 734531,
    },
  },
})

export const SAPPHIRE_1RPC_CHAIN_CONFIG = defineChain({
  id: 23294,
  name: 'Oasis Sapphire',
  network: 'sapphire',
  nativeCurrency: { name: 'Sapphire Rose', symbol: 'ROSE', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://1rpc.io/oasis/sapphire'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/mainnet/sapphire',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 734531,
    },
  },
})

export const SAPPHIRE_TESTNET_CHAIN_CONFIG = defineChain({
  id: 23295,
  name: 'Oasis Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: { name: 'Sapphire Test Rose', symbol: 'TEST', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://testnet.sapphire.oasis.dev'],
      webSocket: ['wss://testnet.sapphire.oasis.dev/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Oasis Explorer',
      url: 'https://explorer.oasis.io/testnet/sapphire',
    },
  },
  testnet: true,
})

export const SUPPORTED_CHAIN_IDS: Record<number, Chain> = {
  [23294]: SAPPHIRE_1RPC_CHAIN_CONFIG,
  [23295]: SAPPHIRE_TESTNET_CHAIN_CONFIG,
}

export const NEXUS_BASE_URL_CONFIG: Map<number, string> = new Map([
  [23294, 'https://nexus.oasis.io/v1/'],
  [23295, 'https://testnet.nexus.oasis.io/v1/'],
])

export const GRPC_URL_CONFIG: Map<number, string> = new Map([
  [23294, 'https://grpc.oasis.io'],
  [23295, 'https://testnet.grpc.oasis.io'],
])

export const NETWORK_NAMES: Record<string, string> = {
  'Oasis Sapphire': 'Sapphire',
  'Oasis Sapphire Testnet': 'Sapphire Testnet',
}

export const OASIS_HOME_PAGE_TOKENOMICS_URL = 'https://oasisprotocol.org/rose-and-tokenomics'
export const OASIS_DOCS_PAGE_URL = 'https://docs.oasis.io/'
export const OASIS_EXPLORER_SAPPHIRE_MAINNET_PAGE_URL = 'https://explorer.oasis.io/mainnet/sapphire'

export const GAS_LIMIT_STAKE = 100_000n
export const GAS_LIMIT_UNSTAKE = 150_000n

export const AVERAGE_BLOCK_TIME_IN_SEC = 6
export const AVERAGE_BLOCKS_PER_EPOCH = 600
export const CONSENSUS_DECIMALS = 9
export const NEXUS_COMMISSION_RATE_DECIMALS = 5
export const MIN_STAKE_AMOUNT = 100_000_000_000n

// Specifies multiplier so wallet has enough fees for future transactions
export const FEE_DEDUCTION_MULTIPLIER = 5
