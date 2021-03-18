import { run as clientBuildRun } from './build-client'
import { run as serverBuildRun } from './build-server'
import { run as prerenderRun } from './prerender'
import { UserConfig } from 'vite'
import { rmSync } from 'fs'

import { join } from 'path'

interface CustomOptions {
  outDirClient: string
  outDirServer: string
}

type SSROptions = UserConfig & Partial<CustomOptions>
type SSGOptions = SSROptions

const runSSG = async (options?: SSGOptions): Promise<void> => {
  const outDir = options?.build?.outDir || 'dist'
  rmSync(outDir, {
    recursive: true,
    force: true
  })
  await Promise.all(
    [
      clientBuildRun(join(outDir, options?.outDirClient || 'static')),
      serverBuildRun(join(outDir, options?.outDirServer || 'server'))
    ].map((fn) => fn())
  )

  await prerenderRun(options)
}

const runSSR = async (options: SSROptions): Promise<void> => {
  const outDir = options?.build?.outDir || 'dist'
  rmSync(outDir, {
    recursive: true,
    force: true
  })
  await Promise.all(
    [
      clientBuildRun(join(outDir, options?.outDirClient || 'client')),
      serverBuildRun(join(outDir, options?.outDirServer || 'server'))
    ].map((fn) => fn())
  )
}

export { runSSR, runSSG }
