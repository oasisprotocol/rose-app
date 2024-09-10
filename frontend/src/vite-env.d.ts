/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_NETWORK: string
  VITE_REACT_APP_BUILD_VERSION: string
  VITE_REACT_APP_BUILD_DATETIME: string
  VITE_NEXUS_BASE_URL: string
  VITE_GRPC_URL: string
  VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
