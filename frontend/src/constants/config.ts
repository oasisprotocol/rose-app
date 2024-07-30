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

export const CHAINS: Map<bigint, AddEthereumChainParameter> = new Map([
  [
    23294n,
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
    23295n,
    {
      chainId: '0x5aff',
      chainName: 'Oasis Sapphire Testnet',
      nativeCurrency: { name: 'TEST', symbol: 'TEST', decimals: 18 },
      rpcUrls: ['https://testnet.sapphire.oasis.dev/', 'wss://testnet.sapphire.oasis.dev/ws'],
      blockExplorerUrls: ['https://explorer.oasis.io/testnet/sapphire'],
    },
  ],
])

export const NETWORK_NAMES: Record<string, string> = {
  'Oasis Sapphire': 'Sapphire',
  'Oasis Sapphire Testnet': 'Sapphire Testnet',
}

export const METAMASK_HOME_PAGE_URL = 'https://metamask.io/'
export const GITHUB_REPOSITORY_URL = 'https://github.com/oasisprotocol/dapp-staker/'

export const MAX_GAS_LIMIT = 275000n

export const AVERAGE_BLOCK_TIME_IN_MS = 6
export const AVERAGE_BLOCKS_PER_EPOCH = 600

const {
  VITE_NETWORK: ENV_VITE_NETWORK,
  VITE_WEB3_GATEWAY,
  VITE_STAKING_CONTRACT_ADDRESS,
  VITE_REACT_APP_BUILD_VERSION,
  VITE_REACT_APP_BUILD_DATETIME: ENV_VITE_REACT_APP_BUILD_DATETIME,
  VITE_NEXUS_BASE_URL,
  VITE_GRPC_URL,
} = import.meta.env

const VITE_NETWORK = BigInt(ENV_VITE_NETWORK) ?? 0n
const VITE_REACT_APP_BUILD_DATETIME = Number(ENV_VITE_REACT_APP_BUILD_DATETIME) ?? 0

export {
  VITE_NETWORK,
  VITE_WEB3_GATEWAY,
  VITE_STAKING_CONTRACT_ADDRESS,
  VITE_REACT_APP_BUILD_VERSION,
  VITE_REACT_APP_BUILD_DATETIME,
  VITE_NEXUS_BASE_URL,
  VITE_GRPC_URL,
}
