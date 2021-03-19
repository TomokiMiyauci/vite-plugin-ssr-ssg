import { readFileSync } from 'fs'
import express, { Express, static as _static } from 'express'
import { toRootAbsolute } from '../utils'
import { existsSync } from 'fs'
import compression from 'compression'
import { CYAN, GREEN, RESET, YELLOW } from '../constants'

type Mode = 'CSR' | 'SSR' | 'UNKNOWN'

const detectMode = (): Mode => {
  const isExistsDistIndex = existsSync(toRootAbsolute('dist', 'index.html'))
  if (isExistsDistIndex) return 'CSR'
  else if (existsSync(toRootAbsolute('dist', 'server', 'entry-server.js')))
    return 'SSR'
  else return 'UNKNOWN'
}

const createServer = async (): Promise<{
  app: Express
  mode: 'CSR' | 'SSR'
}> => {
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
    const { render } = await (import(
      toRootAbsolute('dist', 'server', 'entry-server')
    ) as any)

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

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    })
  }

  return { app, mode }
}

createServer().then(({ app, mode }) =>
  app.listen(5000, () => {
    console.clear()
    console.log(
      `${CYAN}vite-plugin-ssr-ssg ${GREEN}build preview ${YELLOW}${
        mode === 'CSR' ? 'static' : 'node'
      } server${GREEN} running at:${RESET}\n`
    )
    console.log('> Local:  ', `${CYAN}http://localhost:5000/${RESET}`)
  })
)

export { createServer }
