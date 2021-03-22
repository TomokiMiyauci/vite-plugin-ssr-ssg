import { readFileSync } from 'fs'
import { ViteDevServer } from 'vite'
import express, { Express } from 'express'
import { toRootAbsolute } from '../utils'
import { createServer as _createServer } from 'vite'
import { CYAN, GREEN, RESET } from '../constants'
import { Render } from '../types'

const createServer = async (
  root = process.cwd()
): Promise<{
  app: Express
  vite: ViteDevServer | undefined
}> => {
  const app = express()
  const vite = await _createServer({
    root,
    logLevel: 'info',
    server: {
      middlewareMode: true
    }
  })

  const { default: render } = (await vite.ssrLoadModule(
    toRootAbsolute('src', 'entry-server')
  )) as { default: Render }
  const index = readFileSync(toRootAbsolute('index.html'), 'utf-8')
  app.use(vite.middlewares)

  app.use('*', async ({ originalUrl }, res) => {
    const context = {} as { url: string }
    const { bodyTags, bodyAttrs, htmlAttrs, headTags } = await render(
      originalUrl,
      {}
    )

    if (context.url) {
      return res.redirect(301, context.url)
    }

    const template = await vite.transformIndexHtml(originalUrl, index)
    const html = template
      .replace('<html', `<html ${htmlAttrs} `)
      .replace('<body', `<body ${bodyAttrs} `)
      .replace('</head>', `${headTags}\n</head>`)
      .replace(`<!--app-html-->`, bodyTags)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  })

  return { app, vite }
}

const run = (port: number) =>
  createServer().then(({ app }) =>
    app.listen(port, () => {
      console.clear()
      console.log(
        `${CYAN}vite-plugin-ssr-ssg ${GREEN}dev server running at:${RESET}\n`
      )
      console.log('> Local:  ', `${CYAN}http://localhost:${port}/${RESET}`)
    })
  )

export { createServer, run }
