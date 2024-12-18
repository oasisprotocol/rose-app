import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import svgr from 'vite-plugin-svgr'
import pkg from './package.json' assert { type: 'json' }
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        /^node:.*/,
        /\?url$/,
      ],
    },
    target: 'esnext',
  },
  resolve: { alias: { src: resolve('src/') } },
  plugins: [svgr(), dts()], // emit TS declaration files
})
