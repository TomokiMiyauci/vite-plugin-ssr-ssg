import { run as clientBuildRun } from '../build-client'
import { run as serverBuildRun } from '../build-server'
import { join } from 'path'

const run = async (): Promise<void> => {
  await Promise.all(
    [clientBuildRun(join('dist', 'client')), serverBuildRun].map((fn) => fn())
  )
}

run()
