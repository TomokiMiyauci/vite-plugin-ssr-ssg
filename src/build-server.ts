import { build } from 'vite'
import { toRootAbsolute } from './utils'

export const run = (outDir: string) => async (): Promise<void> => {
  await build({
    build: {
      ssr: toRootAbsolute('src', 'entry-server'),
      outDir
    }
  })
}
