import { Chain } from 'viem'
import { sapphire, sapphireTestnet } from 'viem/chains'

export const SUPPORTED_CHAIN_IDS: Record<number, Chain> = {
  [23294]: sapphire,
  [23295]: sapphireTestnet,
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
export const OASIS_EXPLORER_SAPPHIRE_MAINNET_PAGE_URL = 'https://explorer.oasis.io/mainnet/sapphire'

export const GAS_LIMIT_STAKE = 100_000n
export const GAS_LIMIT_UNSTAKE = 150_000n

export const AVERAGE_BLOCK_TIME_IN_SEC = 6
export const AVERAGE_BLOCKS_PER_EPOCH = 600
export const CONSENSUS_DECIMALS = 9
export const MIN_STAKE_AMOUNT = 100_000_000_000n
