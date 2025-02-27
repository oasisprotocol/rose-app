export const oasisConfig = {
  mainnet: {
    grpc: 'https://grpc.oasis.io',
  },
  testnet: {
    grpc: 'https://testnet.grpc.oasis.io',
  },
}

export const sapphireConfig = {
  mainnet: {
    address: 'oasis1qrd3mnzhhgst26hsp96uf45yhq6zlax0cuzdgcfc',
    runtimeId: '000000000000000000000000000000000000000000000000f80306c9858e7279',
  },
  testnet: {
    address: 'oasis1qqczuf3x6glkgjuf0xgtcpjjw95r3crf7y2323xd',
    runtimeId: '000000000000000000000000000000000000000000000000a6d1e3ebf60dff6c',
  },
  decimals: 18,
  gasPrice: 100n,
  feeGas: 70_000n, // hardcoded. TODO: update when sapphire is upgraded
}

export const consensusConfig = {
  decimals: 9,
}

export const multiplyConsensusToSapphire = 10n ** BigInt(sapphireConfig.decimals - consensusConfig.decimals)

declare global {
  interface Window {
    mock: boolean
  }
}
// Continue the depositing flow with 0 ROSE. Can be switched on anytime.
window.mock = false

export const amountPattern = '^[0-9]*[.]?[0-9]{0,9}$'
