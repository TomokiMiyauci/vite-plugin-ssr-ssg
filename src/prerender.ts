import { writeFileSync, readFileSync } from 'fs'
import { resolve, join } from 'path'

const toAbsolute = (path: string): string => resolve(__dirname, '..', path)
// const routesToPrerender = readdirSync(toAbsolute(join('src', 'pages'))).map(
//   (file) => {
//     const name = file.replace(/\.(jsx|tsx)$/, '').toLowerCase()
//     return name === 'index' ? '/' : `/${name}`
//   }
// )
const run = async () => {
  const { render } = require('../dist/server/entry-server')
  const template = readFileSync(
    toAbsolute(join('dist', 'static', 'index.html')),
    'utf-8'
  )

  const pages = ['/']

  pages.forEach(async (url) => {
    const appHtml = await render(url, {})
    const html = template.replace(`<!--app-html-->`, appHtml)
    const filePath = `dist/static${url === '/' ? '/index' : url}.html`
    writeFileSync(toAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  })
}

export { run }
