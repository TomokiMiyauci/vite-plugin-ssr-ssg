import { readFileSync } from 'fs'
import express, { Express, static as _static } from 'express'
import { toRootAbsolute } from '../utils'
import { existsSync } from 'fs'
import compression from 'compression'
import { CYAN, GREEN, RESET, YELLOW } from '../constants'
import { Render } from '../types'

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
      'Outputs are not exist. Should be do vite-ssrg build or vite-ssrg generate commands first.'
    )
  }

  const app = express()
  app.use(compression())
  if (mode === 'CSR') {
    app.use(_static('dist', { extensions: ['html'] }))
  } else {
    const template = readFileSync(
      toRootAbsolute('dist', 'client', 'index.html'),
      'utf-8'
    )
    const {
      default: ssrManifest
    }: { default: Record<string, string[]> } = await import(
      toRootAbsolute('dist', 'client', 'ssr-manifest.json')
    )
    const { default: render } = await (import(
      toRootAbsolute('dist', 'server', 'entry-server')
    ) as Promise<{ default: Render }>)

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
      const { bodyAttrs, headTags, bodyTags, htmlAttrs } = await render(
        originalUrl,
        ssrManifest
      )

      if (context.url) {
        return res.redirect(301, context.url)
      }

      const html = template
        .replace('<html', `<html ${htmlAttrs} `)
        .replace('<body', `<body ${bodyAttrs} `)
        .replace('</head>', `${headTags}\n</head>`)
        .replace(`<!--app-html-->`, bodyTags)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    })
  }

  return { app, mode }
}

const run = (port: number) =>
  createServer().then(({ app, mode }) =>
    app.listen(port, () => {
      console.clear()
      console.log(
        `${CYAN}vite-plugin-ssr-ssg ${GREEN}build preview ${YELLOW}${
          mode === 'CSR' ? 'static' : 'node'
        } server${GREEN} running at:${RESET}\n`
      )
      console.log('> Local:  ', `${CYAN}http://localhost:${port}/${RESET}`)
    })
  )

export { createServer, run }
