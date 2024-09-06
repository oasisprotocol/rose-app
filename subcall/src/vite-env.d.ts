/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SUBCALL_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
