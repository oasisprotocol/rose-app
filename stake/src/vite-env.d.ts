/// <reference types="vite/client" />

declare const APP_VERSION: string
declare const BUILD_COMMIT: string
declare const BUILD_DATETIME: number
declare const GITHUB_REPOSITORY_URL: string
declare const OASIS_HOME_PAGE_URL: string
declare const OASIS_DOCS_PAGE_URL: string
declare const PRIVACY_POLICY_URL: string

interface ImportMetaEnv {
  VITE_WALLET_CONNECT_PROJECT_ID: string
  VITE_FATHOM_SITE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
