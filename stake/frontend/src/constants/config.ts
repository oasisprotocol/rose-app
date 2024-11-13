// EIP-3085: wallet_addEthereumChain RPC Method
interface AddEthereumChainParameter {
  chainId: string
  chainName: string
  iconUrls?: string[]
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
}

export const CHAINS: Map<number, AddEthereumChainParameter> = new Map([
  [
    23294,
    {
      chainId: '0x5afe',
      chainName: 'Oasis Sapphire',
      nativeCurrency: {
        name: 'ROSE',
        symbol: 'ROSE',
        decimals: 18,
      },
      rpcUrls: ['https://sapphire.oasis.io/', 'wss://sapphire.oasis.io/ws'],
      blockExplorerUrls: ['https://explorer.oasis.io/mainnet/sapphire'],
    },
  ],
  [
    23295,
    {
      chainId: '0x5aff',
      chainName: 'Oasis Sapphire Testnet',
      nativeCurrency: { name: 'TEST', symbol: 'TEST', decimals: 18 },
      rpcUrls: ['https://testnet.sapphire.oasis.dev/', 'wss://testnet.sapphire.oasis.dev/ws'],
      blockExplorerUrls: ['https://explorer.oasis.io/testnet/sapphire'],
    },
  ],
])

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

export const GITHUB_REPOSITORY_URL = 'https://github.com/oasisprotocol/rose/'
export const OASIS_HOME_PAGE_URL = 'https://oasisprotocol.org/'
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
