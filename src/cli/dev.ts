import { readFileSync } from 'fs'
import { ViteDevServer } from 'vite'
import express, { Express } from 'express'
import { toRootAbsolute } from '../utils'
import { createServer as _createServer } from 'vite'

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

  const { render } = await vite.ssrLoadModule(
    toRootAbsolute('src', 'entry-server')
  )
  const index = readFileSync(toRootAbsolute('index.html'), 'utf-8')
  app.use(vite.middlewares)

  app.use('*', async ({ originalUrl }, res) => {
    const context = {} as { url: string }
    const appHtml = await render(originalUrl, context)

    if (context.url) {
      return res.redirect(301, context.url)
    }

    const template = await vite.transformIndexHtml(originalUrl, index)
    const html = template.replace(`<!--app-html-->`, appHtml) ?? ''

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  })

  return { app, vite }
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('http://localhost:3000')
  })
)

export { createServer }
