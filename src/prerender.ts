import { writeFileSync, readFileSync } from 'fs'
import { toRootAbsolute } from './utils'
import { join } from 'path'
// const routesToPrerender = readdirSync(toAbsolute(join('src', 'pages'))).map(
//   (file) => {
//     const name = file.replace(/\.(jsx|tsx)$/, '').toLowerCase()
//     return name === 'index' ? '/' : `/${name}`
//   }
// )
interface Options {
  outDir?: string
  outDirClient?: string
  outDirServer?: string
}
const run = async (options?: Options) => {
  const { render } = require(toRootAbsolute(
    options?.outDir || 'dist',
    options?.outDirServer || 'server',
    'entry-server'
  ))
  const template = readFileSync(
    toRootAbsolute(
      options?.outDir || 'dist',
      options?.outDirClient || 'static',
      'index.html'
    ),
    'utf-8'
  )

  const pages = ['/']

  pages.forEach(async (url) => {
    const appHtml = await render(url, {})
    const html = template.replace(`<!--app-html-->`, appHtml)
    const filePath = join(
      options?.outDir || 'dist',
      options?.outDirClient || 'static',
      `${url === '/' ? 'index' : url}.html`
    )
    writeFileSync(toRootAbsolute(filePath), html)
    console.log('pre-rendered:', filePath)
  })
}

export { run }
