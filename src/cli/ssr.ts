import { runSSR } from '../runner'

import yargs from 'yargs/yargs'
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv

runSSR({
  outDirClient: argv.outDirClient as string | undefined,
  outDirServer: argv.outDirServer as string | undefined,
  ...argv
})
