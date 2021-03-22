import { writeFileSync, readFileSync } from 'fs'
import { toRootAbsolute, getRoutePaths } from './utils'
import { join } from 'path'
import { CYAN, GREEN, RESET, GRAY } from './constants'
import { Render } from './types'

interface Options {
  outDir?: string
  outDirClient?: string
  outDirServer?: string
}
const run = async (options?: Options) => {
  const { default: render } = require(toRootAbsolute(
    options?.outDir ?? 'dist',
    options?.outDirServer ?? 'server',
    'entry-server'
  )) as {
    default: Render
  }
  const template = readFileSync(
    toRootAbsolute(options?.outDir ?? 'dist', 'index.html'),
    'utf-8'
  )

  const pages = getRoutePaths()

  console.log(`\n${CYAN}vite-plugin-ssr-ssg ${GREEN}pre-rendered:${RESET}\n`)

  await Promise.all(
    pages.map(async (url) => {
      const { bodyTags, headTags, htmlAttrs, bodyAttrs } = await render(url, {})
      const html = template
        .replace('<html', `<html ${htmlAttrs ?? ''}`)
        .replace('<body', `<body ${bodyAttrs ?? ''}`)
        .replace('</head>', `${headTags ?? ''}\n</head>`)
        .replace(`<!--app-html-->`, bodyTags)
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
        )}${GREEN}${url === '/' ? 'index' : url.slice(1)}.html${RESET}`
      )
    })
  )
}

export { run }
