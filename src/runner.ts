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
  await runSSR({ ...options, outDirClient: '' })
  await prerenderRun(options)
  rmSync(
    join(options?.build?.outDir ?? 'dist', options?.outDirServer ?? 'server'),
    {
      recursive: true,
      force: true
    }
  )
}

const runSSR = async (options?: SSROptions): Promise<void> => {
  const outDir = options?.build?.outDir ?? 'dist'
  rmSync(outDir, {
    recursive: true,
    force: true
  })
  await clientBuildRun(join(outDir, options?.outDirClient ?? 'client'))()
  await serverBuildRun(join(outDir, options?.outDirServer ?? 'server'))()
}

export { runSSR, runSSG }
