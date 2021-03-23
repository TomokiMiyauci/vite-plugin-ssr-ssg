import { run as clientBuildRun } from './build-client'
import { run as serverBuildRun } from './build-server'
import { run as prerenderRun } from './prerender'
import { ResolvedConfig } from 'vite'
import { rmSync } from 'fs'
import { PluginOptions } from './types'

import { join } from 'path'

type SSROptions = ResolvedConfig &
  Partial<{ ssrgOptions: Partial<PluginOptions> }>
type SSGOptions = SSROptions

const runSSG = async (options?: SSGOptions): Promise<void> => {
  if (options && !options?.ssrgOptions?.build?.outDirClient) {
    options = {
      ...options,
      ssrgOptions: {
        ...options.ssrgOptions,
        build: {
          ...options.ssrgOptions?.build,
          outDirClient: ''
        }
      }
    }
  }
  await runSSR(options)
  await prerenderRun(options)
  rmSync(
    join(
      options?.build?.outDir ?? 'dist',
      options?.ssrgOptions?.build?.outDirServer ?? 'server'
    ),
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

  await clientBuildRun(
    join(outDir, options?.ssrgOptions?.build?.outDirClient ?? 'client'),
    options?.build?.ssrManifest
  )()
  await serverBuildRun(
    join(outDir, options?.ssrgOptions?.build?.outDirServer ?? 'server')
  )()
}

export { runSSR, runSSG }
