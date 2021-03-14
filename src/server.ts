import { readFileSync } from 'fs'
import { resolve as _resolve } from 'path'
import { ViteDevServer } from 'vite'
import express, { Express, RequestHandler } from 'express'
import { isTest } from './constants'

const resolve = (path: string): string => _resolve(__dirname, path)

const getViteInstance = async <T extends boolean>(
  isProd: T,
  root: string
): Promise<ViteDevServer | undefined> => {
  if (isProd) return undefined

  const {
    default: { createServer }
  } = await import('vite')
  return await createServer({
    root,
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: true
    }
  })
}

const handler = (
  isProd: boolean,
  vite: ViteDevServer,
  index: string
): RequestHandler => async ({ originalUrl }, res) => {
  try {
    const template = isProd
      ? index
      : await vite.transformIndexHtml(
          originalUrl,
          readFileSync(resolve('index.html'), 'utf-8')
        )
    const render = isProd
      ? (await import('./dist/server/entry-server.js')).render
      : (await vite.ssrLoadModule('/src/entry-server.tsx')).render

    const context = {} as { url: string }
    const appHtml = render(originalUrl, context)

    if (context.url) {
      // Somewhere a `<Redirect>` was rendered
      return res.redirect(301, context.url)
    }

    const html = template.replace(`<!--app-html-->`, appHtml)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
  } catch (e) {
    !isProd && vite.ssrFixStacktrace(e)
    console.log(e.stack)
    res.status(500).end(e.stack)
  }
}

const createServer = async (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
): Promise<{
  app: Express
  vite: ViteDevServer
}> => {
  const indexProd = isProd
    ? readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const app = express()
  const vite = await getViteInstance(isProd, root)

  if (!isProd) {
    app.use(vite.middlewares)
  } else {
    app.use(await (await import('compression')).default())
    app.use(
      await (await import('serve-static')).default(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('*', handler(isProd, vite, indexProd))

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  )
}

export { createServer }
