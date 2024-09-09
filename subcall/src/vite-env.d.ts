/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SUBCALL_ADDRESS: string
  VITE_PARATIME_RUNTIME_ID: string
  VITE_GRPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
