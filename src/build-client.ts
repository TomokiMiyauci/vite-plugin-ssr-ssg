import { build } from 'vite'

export const run = (outDir: string) => async (): Promise<void> => {
  await build({
    build: {
      outDir
    }
  })
}
