import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dapp-onramp/',
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_COMMIT: JSON.stringify(execSync('git rev-parse HEAD').toString()),
    BUILD_DATETIME: JSON.stringify(new Date().getTime()),
    GITHUB_REPOSITORY_URL: JSON.stringify('https://github.com/oasisprotocol/dapp-onramp/'),
    OASIS_HOME_PAGE_URL: JSON.stringify('https://oasisprotocol.org/'),
  },
})
