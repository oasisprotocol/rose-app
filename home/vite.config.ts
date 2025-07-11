import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { version } from '../package.json'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), svgr(), react(), tailwindcss()],
  base: '/',
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  define: {
    APP_VERSION: JSON.stringify(version),
    BUILD_COMMIT: JSON.stringify(execSync('git rev-parse HEAD').toString().trim()),
    BUILD_DATETIME: JSON.stringify(new Date().getTime()),
    GITHUB_REPOSITORY_URL: JSON.stringify('https://github.com/oasisprotocol/rose-app/'),
    OASIS_HOME_PAGE_URL: JSON.stringify('https://oasisprotocol.org/'),
    OASIS_DOCS_PAGE_URL: JSON.stringify('https://docs.oasis.io/'),
    PRIVACY_POLICY_URL: JSON.stringify('https://oasisprotocol.org/privacy-policy'),
  },
})
