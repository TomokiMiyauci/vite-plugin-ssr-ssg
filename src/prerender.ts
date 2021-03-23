import {
  toRootAbsolute,
  getRoutePaths,
  toIndexHTML,
  addStartSlash,
  removeEndSlash,
  removeDuplicate
} from './utils'
import { join } from 'path'
import { CYAN, GREEN, RESET } from './constants'
import { Render, PluginOptions, RoutesOption } from './types'
import { ResolvedConfig } from 'vite'
import { outputFileSync, readFileSync } from 'fs-extra'
import consola from 'consola'

const failRenderPlaceholder = ['<!---->']

const getRoutes = async (routes: RoutesOption): Promise<string[]> => {
  if (Array.isArray(routes)) {
    return routes
  } else {
    return await routes()
  }
}

type Options = ResolvedConfig & Partial<{ ssrgOptions: Partial<PluginOptions> }>
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
  const pages: string[] = removeDuplicate([
    ..._pages,
    ...(await getRoutes(options?.ssrgOptions?.generate?.routes || []))
      .map(addStartSlash)
      .map(removeEndSlash)
  ])

  console.log(`\n${CYAN}vite-plugin-ssr-ssg ${GREEN}pre-rendered:${RESET}\n`)

  await Promise.all(
    pages.map(async (url) => {
      const { bodyTags, headTags, htmlAttrs, bodyAttrs } = await render(url, {})
      if (failRenderPlaceholder.includes(bodyTags)) {
        consola.error(
          `Error generating route "${url}": This page could not be found`
        )
        return
      }
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

      const toIndexHTMLPath = toIndexHTML(filePath)

      outputFileSync(toRootAbsolute(toIndexHTMLPath), html)
      consola.success('Generated route', `"${toIndexHTMLPath}"`)
    })
  )
}

export { run }
