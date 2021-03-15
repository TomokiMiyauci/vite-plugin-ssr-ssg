import { run as clientBuildRun } from './build-client'
import { run as serverBuildRun } from './build-server'
import { run as prerenderRun } from './prerender'
import { UserConfig } from 'vite'

import { join } from 'path'

interface CustomOptions {
  outDirClient: string
  outDirServer: string
}

type SSROptions = UserConfig & Partial<CustomOptions>
type SSGOptions = SSROptions

const runSSG = async (options?: SSGOptions): Promise<void> => {
  await Promise.all(
    [
      clientBuildRun(
        join(
          options?.build?.outDir || 'dist',
          options?.outDirClient || 'static'
        )
      ),
      serverBuildRun(
        join(
          options?.build?.outDir || 'dist',
          options?.outDirServer || 'server'
        )
      )
    ].map((fn) => fn())
  )

  await prerenderRun(options)
}

const runSSR = async (options: SSROptions): Promise<void> => {
  await Promise.all(
    [
      clientBuildRun(
        join(
          options?.build?.outDir || 'dist',
          options?.outDirClient || 'client'
        )
      ),
      serverBuildRun(
        join(
          options?.build?.outDir || 'dist',
          options?.outDirServer || 'server'
        )
      )
    ].map((fn) => fn())
  )
}

export { runSSR, runSSG }
