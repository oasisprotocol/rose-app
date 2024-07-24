/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_NETWORK: string
  VITE_WEB3_GATEWAY: string
  VITE_STAKING_CONTRACT_ADDRESS: string
  VITE_REACT_APP_BUILD_VERSION: string
  VITE_REACT_APP_BUILD_DATETIME: string
  VITE_NEXUS_BASE_URL: string
  VITE_GRPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
