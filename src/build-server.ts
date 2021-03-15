import { build } from 'vite'
import { resolve } from 'path'

export const run = (outDir: string) => async (): Promise<void> => {
  await build({
    build: {
      ssr: resolve(__dirname, 'entry-server'),
      outDir
    },

    esbuild: {
      jsxInject: `import React from 'react'`
    }
  })
}
