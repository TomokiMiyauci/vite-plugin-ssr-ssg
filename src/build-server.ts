import { build } from 'vite'
import { resolve, join } from 'path'

export const run = async () => {
  await build({
    build: {
      ssr: resolve(__dirname, 'entry-server.tsx'),
      outDir: join('dist', 'server')
    },

    esbuild: {
      jsxInject: `import React from 'react'`
    }
  })
}
