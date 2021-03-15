import { build } from 'vite'
import { resolve } from 'path'
import { toRootAbsolute } from './utils'

export const run = async () => {
  await build({
    build: {
      ssr: resolve(__dirname, 'entry-server'),
      outDir: toRootAbsolute('dist', 'server')
    },

    esbuild: {
      jsxInject: `import React from 'react'`
    }
  })
}
