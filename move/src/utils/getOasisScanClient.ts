import { Api } from '../generated/OasisScanV2Api.ts'

const { PROD } = import.meta.env

const OASISSCAN_MAINNET_BASE_URL = 'https://api.oasisscan.com/v2/mainnet'
const OASISSCAN_TESTNET_BASE_URL = 'https://api.oasisscan.com/v2/testnet'

export const getOasisScanClient = () =>
  new Api({
    baseUrl: PROD ? OASISSCAN_MAINNET_BASE_URL : OASISSCAN_TESTNET_BASE_URL,
  })
