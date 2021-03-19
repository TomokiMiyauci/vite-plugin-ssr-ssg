import { readFileSync } from 'fs'
import express, { Express, static as _static } from 'express'
import { toRootAbsolute } from '../utils'
import { existsSync } from 'fs'
import compression from 'compression'

type Mode = 'CSR' | 'SSR' | 'UNKNOWN'

const detectMode = (): Mode => {
  const isExistsDistIndex = existsSync(toRootAbsolute('dist', 'index.html'))
  if (isExistsDistIndex) return 'CSR'
  else if (existsSync(toRootAbsolute('dist', 'server', 'entry-server.js')))
    return 'SSR'
  else return 'UNKNOWN'
}

const createServer = async (): Promise<Express> => {
  const mode = detectMode()
  if (mode === 'UNKNOWN') {
    throw Error(
      'Outputs are not exist. Should be do vite-ssr or vite-ssg commands first.'
    )
  }

  const app = express()
  app.use(compression())
  if (mode === 'CSR') {
    app.use(_static('dist'))
  } else {
    const template = readFileSync(
      toRootAbsolute('dist', 'client', 'index.html'),
      'utf-8'
    )
    const render = await (import(
      toRootAbsolute('dist', 'server', 'entry-server')
    ) as any).render

    app.use(
      await (await import('serve-static')).default(
        toRootAbsolute('dist', 'client'),
        {
          index: false
        }
      )
    )
    app.use('*', async ({ originalUrl }, res) => {
      const context = {} as { url: string }
      const appHtml = await render(originalUrl, context)

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url)
      }

      const html = template?.replace(`<!--app-html-->`, appHtml) ?? ''
      console.log(html)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    })
  }

  return app
}

createServer().then((app) =>
  app.listen(5000, () => {
    console.log('http://localhost:5000')
  })
)

export { createServer }
