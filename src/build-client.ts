import { build } from 'vite'

export const run = (
  outDir: string,
  ssrManifest?: boolean
) => async (): Promise<void> => {
  await build({
    build: {
      outDir,
      ssrManifest
    }
  })
}
