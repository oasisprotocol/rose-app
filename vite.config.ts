import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'Allow opening /move/ in dev mode, not just /move/index.html',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url === '/move/') req.url += 'index.html'
          if (req.url === '/stake/') req.url += 'index.html'
          next()
        })
      },
    },
  ],
  base: '/',
})
