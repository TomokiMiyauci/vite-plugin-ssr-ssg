const { hideBin } = require('yargs/helpers')
import yargs from 'yargs/yargs'
import { run as runDev } from './dev'
import { run as runPreview } from './preview'
import { runSSG, runSSR } from '../runner'
import { rewritePackageJson } from '../init'
import { toRootAbsolute } from '../utils'

yargs(hideBin(process.argv))
  .command(
    ['dev', '*'],
    'start the dev server',
    ({ positional }) =>
      positional('port', {
        describe: 'port to bind on',
        default: 3000
      }),
    ({ port }) => runDev(port)
  )
  .command(
    ['init'],
    'init vite-ssrg project',
    ({ positional }) =>
      positional('framework', {
        describe: 'overwrite framework',
        default: undefined
      }),
    () => rewritePackageJson(toRootAbsolute('package.json'))
  )
  .command(
    'build',
    'start the SSR mode',
    ({ positional }) =>
      positional('outDirClient', {
        describe: 'client side outputs directory',
        default: undefined
      }).positional('outDirServer', {
        describe: 'server side outputs directory',
        default: undefined
      }),
    ({ outDirClient, outDirServer }) =>
      runSSR({
        outDirClient,
        outDirServer,
        build: {
          ssrManifest: true
        }
      })
  )
  .command(
    'generate',
    'start the SSG mode',
    ({ positional }) =>
      positional('outDirClient', {
        describe: 'client side outputs directory',
        default: undefined
      }).positional('outDirServer', {
        describe: 'server side outputs directory',
        default: undefined
      }),
    ({ outDirClient, outDirServer }) =>
      runSSG({
        outDirClient,
        outDirServer
      })
  )
  .command(
    'preview',
    'start the preview server',
    ({ positional }) =>
      positional('port', {
        describe: 'port to bind on',
        default: 5000
      }),
    ({ port }) => runPreview(port)
  )
  .alias('h', 'help')
  .alias('v', 'version')
  .strict().argv
