import { run as clientBuildRun } from '../build-client'
import { run as serverBuildRun } from '../build-server'
import { run as prerenderRun } from '../prerender'

import { join } from 'path'

const run = async (): Promise<void> => {
  await Promise.all(
    [clientBuildRun(join('dist', 'static')), serverBuildRun].map((fn) => fn())
  )

  await prerenderRun()
}

run()
