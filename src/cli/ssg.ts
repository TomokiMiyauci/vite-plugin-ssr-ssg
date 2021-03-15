import { runSSG } from '../runner'

import yargs from 'yargs/yargs'
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv

runSSG({
  outDirClient: argv.outDirClient as string | undefined,
  outDirServer: argv.outDirServer as string | undefined,
  ...argv
})
