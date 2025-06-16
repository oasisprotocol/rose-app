import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import path from 'node:path'
import pkg from './package.json' assert { type: 'json' }
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { version } from '../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
    svgr(),
    react(),
    tailwindcss(),
    viteCommonjs({
      include: ['@routerprotocol/**'],
    }),
  ],
  base: '/',
  build: {
    sourcemap: true,
    rollupOptions: {
      external: [
        // Remove Router Protocol packages from externals so they get bundled
        ...Object.keys(pkg.dependencies).filter(dep => !dep.startsWith('@routerprotocol/')),
        /^node:.*/,
      ],
    },
    commonjsOptions: {
      include: [/semver/, /@ledgerhq/, /@routerprotocol/, /cosmos/, /node_modules/],
      transformMixedEsModules: true,
      strictRequires: true,
    },
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      '@routerprotocol/router-asset-transfer-sdk-ts': path.resolve(
        __dirname,
        'node_modules/@routerprotocol/router-asset-transfer-sdk-ts/dist/index.js'
      ),
      '@routerprotocol/router-chain-sdk-ts': path.resolve(
        __dirname,
        'node_modules/@routerprotocol/router-chain-sdk-ts/dist/index.js'
      ),
      '@routerprotocol/chain-api': path.resolve(__dirname, 'node_modules/@routerprotocol/chain-api'),
      '@ledgerhq/devices': path.resolve(__dirname, 'node_modules/@ledgerhq/devices'),
      '@ledgerhq/hw-transport-webhid': path.resolve(
        __dirname,
        'node_modules/@ledgerhq/hw-transport-webhid/lib/TransportWebHID.js'
      ),
      '@ledgerhq/hw-transport-webusb': path.resolve(__dirname, 'node_modules/@ledgerhq/hw-transport-webusb'),
      '@ledgerhq/cryptoassets': path.resolve(__dirname, 'node_modules/@ledgerhq/cryptoassets'),
      'u2f-api': path.resolve(__dirname, 'node_modules/u2f-api'),
      'bn.js': path.resolve(__dirname, 'node_modules/bn.js'),
      'js-sha3': path.resolve(__dirname, 'node_modules/js-sha3'),
      'is-typedarray': path.resolve(__dirname, 'node_modules/is-typedarray'),
      'typedarray-to-buffer': path.resolve(__dirname, 'node_modules/typedarray-to-buffer'),
      '@walletconnect/environment': path.resolve(__dirname, 'node_modules/@walletconnect/environment'),
      '@walletconnect/qrcode-modal': path.resolve(__dirname, 'node_modules/@walletconnect/qrcode-modal'),
      eventemitter3: path.resolve(__dirname, 'node_modules/eventemitter3'),
      'xhr2-cookies': path.resolve(__dirname, 'node_modules/xhr2-cookies'),
      'ethereumjs-util': path.resolve(__dirname, 'node_modules/ethereumjs-util'),
      'google-protobuf': path.resolve(__dirname, 'node_modules/google-protobuf'),
      ethers: path.resolve(__dirname, 'node_modules/ethers/lib.commonjs/index.js'),
    },
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  define: {
    APP_VERSION: JSON.stringify(pkg.version),
    BUILD_COMMIT: JSON.stringify(execSync('git rev-parse HEAD').toString()),
    BUILD_DATETIME: JSON.stringify(new Date().getTime()),
    GITHUB_REPOSITORY_URL: JSON.stringify('https://github.com/oasisprotocol/rose-app/'),
    OASIS_HOME_PAGE_URL: JSON.stringify('https://oasisprotocol.org/'),
    OASIS_DOCS_PAGE_URL: JSON.stringify('https://docs.oasis.io/'),
    PRIVACY_POLICY_URL: JSON.stringify('https://oasisprotocol.org/privacy-policy'),
  },
  optimizeDeps: {
    include: [
      'semver',
      // Include all Ledger packages for proper bundling
      /*'@ledgerhq/devices',
      '@ledgerhq/hw-transport',
      '@ledgerhq/hw-transport-webhid',
      '@ledgerhq/hw-transport-webusb',
      '@ledgerhq/logs',*/
      // Force include ALL Router Protocol packages and their dependencies
      /*'@routerprotocol/chain-api',
      '@routerprotocol/chain-api/!**',
      '@routerprotocol/router-chain-sdk-ts',
      '@routerprotocol/router-chain-sdk-ts/!**'*/
    ],
    exclude: [
      // Exclude problematic packages from pre-bundling
      /*'@routerprotocol/router-asset-transfer-sdk-ts',
      '@routerprotocol/router-chain-sdk-ts',
      '@routerprotocol/chain-api',*/
      /*'ethers',*/
    ],
    esbuildOptions: {
      // Handle Node.js polyfills if needed
      target: 'esnext',
      format: 'esm',
      supported: {
        bigint: true,
      },
    },
  },
})
