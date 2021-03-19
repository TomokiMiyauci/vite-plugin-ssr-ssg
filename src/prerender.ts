import { writeFileSync, readFileSync } from 'fs'
import { toRootAbsolute, getRoutePaths } from './utils'
import { join } from 'path'
import { CYAN, GREEN, RESET, GRAY } from './constants'

interface Options {
  outDir?: string
  outDirClient?: string
  outDirServer?: string
}
const run = async (options?: Options) => {
  const { render } = require(toRootAbsolute(
    options?.outDir ?? 'dist',
    options?.outDirServer ?? 'server',
    'entry-server'
  ))
  const template = readFileSync(
    toRootAbsolute(options?.outDir ?? 'dist', 'index.html'),
    'utf-8'
  )

  const pages = getRoutePaths()

  console.log(`\n${CYAN}vite-plugin-ssr-ssg ${GREEN}pre-rendered:${RESET}\n`)

  pages.forEach(async (url) => {
    const appHtml = await render(url, {})
    const html = template.replace(`<!--app-html-->`, appHtml)
    const filePath = join(
      options?.outDir ?? 'dist',
      options?.outDirClient ?? '',
      `${url === '/' ? 'index' : url}.html`
    )
    writeFileSync(toRootAbsolute(filePath), html)
    console.log(
      `${GRAY}${join(
        options?.outDir ?? 'dist',
        options?.outDirClient ?? '',
        '/'
      )}${GREEN}${url === '/' ? 'index' : url}.html${RESET}`
    )
  })

  console.log('✨  Done.')
}

export { run }
