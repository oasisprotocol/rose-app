import { defineConfig } from 'orval'

const config = defineConfig({
  nexus: {
    input: {
      target: 'https://raw.githubusercontent.com/oasisprotocol/nexus/main/api/spec/v1.yaml',
    },
    output: {
      target: './dist/index.ts',
      client: 'axios',
      mode: 'single',
      urlEncodeParameters: true,
    },
  },
})

export default config
