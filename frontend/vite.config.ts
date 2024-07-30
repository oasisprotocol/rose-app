import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer() as PluginOption, nodePolyfills()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('ethers')) {
            return 'ethers'
          }
          if (id.includes('react-dom')) {
            return 'react-dom'
          }
        },
      },
    },
  },
})
