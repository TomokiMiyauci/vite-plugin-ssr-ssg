import { writeFileSync, readFileSync } from 'fs'
import { toRootAbsolute, getRoutePaths } from './utils'
import { join } from 'path'
import { CYAN, GREEN, RESET, GRAY } from './constants'
import { Render, PluginOptions } from './types'
import { ResolvedConfig } from 'vite'

type Options = ResolvedConfig & Partial<{ ssrgOptions: PluginOptions }>
const run = async (options?: Options) => {
  const { default: render } = require(toRootAbsolute(
    options?.build?.outDir ?? 'dist',
    options?.ssrgOptions?.build?.outDirServer ?? 'server',
    'entry-server'
  )) as {
    default: Render
  }
  const template = readFileSync(
    toRootAbsolute(options?.build?.outDir ?? 'dist', 'index.html'),
    'utf-8'
  )

  const _pages = getRoutePaths()
  const pages: string[] = [
    ..._pages,
    ...(options?.ssrgOptions?.generate?.routes || [])
  ]

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
        options?.build?.outDir ?? 'dist',
        options?.ssrgOptions?.build?.outDirClient ?? '',
        `${url === '/' ? 'index' : url}.html`
      )
      writeFileSync(toRootAbsolute(filePath), html)
      console.log(
        `${GRAY}${join(
          options?.build?.outDir ?? 'dist',
          options?.ssrgOptions?.build?.outDirClient ?? '',
          '/'
        )}${GREEN}${url === '/' ? 'index' : url.slice(1)}.html${RESET}`
      )
    })
  )
}

export { run }
