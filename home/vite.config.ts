import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), nodePolyfills()],
  base: '/',
  build: {
    sourcemap: true,
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_COMMIT: JSON.stringify(execSync('git rev-parse HEAD').toString()),
    BUILD_DATETIME: JSON.stringify(new Date().getTime()),
    GITHUB_REPOSITORY_URL: JSON.stringify('https://github.com/oasisprotocol/rose/'),
    OASIS_HOME_PAGE_URL: JSON.stringify('https://oasisprotocol.org/'),
  },
})
