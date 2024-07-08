import { defineConfig, PluginOption, splitVendorChunkPlugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), visualizer() as PluginOption],
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
