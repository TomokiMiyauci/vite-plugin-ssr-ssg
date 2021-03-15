import { writeFileSync, readFileSync } from 'fs'
import { toRootAbsolute } from './utils'

// const routesToPrerender = readdirSync(toAbsolute(join('src', 'pages'))).map(
//   (file) => {
//     const name = file.replace(/\.(jsx|tsx)$/, '').toLowerCase()
//     return name === 'index' ? '/' : `/${name}`
//   }
// )
const run = async () => {
  console.log(1, process.env.PWD)
  const { render } = require(toRootAbsolute('dist', 'server', 'entry-server'))
  const template = readFileSync(
    toRootAbsolute('dist', 'static', 'index.html'),
    'utf-8'
  )

  const pages = ['/']

  pages.forEach(async (url) => {
    const appHtml = await render(url, {})
    const html = template.replace(`<!--app-html-->`, appHtml)
    const filePath = `dist/static${url === '/' ? '/index' : url}.html`
    writeFileSync(toRootAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  })
}

export { run }
