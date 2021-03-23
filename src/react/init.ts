import {
  entryServer,
  entryClient,
  aboutTSX,
  appTSX,
  indexTSX
} from './template'
import {
  writeFileSync,
  renameSync,
  readFileSync,
  existsSync,
  mkdirSync
} from 'fs'
import { join, resolve } from 'path'

const getExtension = (isTS: boolean, x?: boolean): string => {
  const _x = x ? 'x' : ''
  return isTS ? `.ts${_x}` : `.js${_x}`
}

const toRootAbsolute = (...path: string[]): string =>
  resolve(process.env.PWD || '', ...path)

const generateServerConfig = (path: string, isTS: boolean) => () => {
  writeFileSync(path, entryServer(isTS), {
    encoding: 'utf-8',
    flag: 'w'
  })
}
const rewriteClientConfig = (path: string) => () => {
  writeFileSync(path, entryClient, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const renameClientConfig = (oldPath: string, newPath: string) => () => {
  renameSync(oldPath, newPath)
}
const rewriteIndexHTML = (path: string, ext: string) => () => {
  const index = readFileSync(path, { encoding: 'utf-8' })

  const replacedHTML = index
    .replace(/<title>.+<\/title>/, '')
    .replace(/<div id="root"><\/div>/, '<div id="root"><!--app-html--></div>')
    .replace(`src="/src/main${ext}"`, `src="/src/entry-client${ext}"`)

  writeFileSync(path, replacedHTML, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const rewriteAppTSX = (path: string, isTS: boolean) => () => {
  writeFileSync(path, appTSX(isTS), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const generatePages = (basePath: string, ext: string) => () => {
  writeFileSync(join(basePath, `Index${ext}`), indexTSX, {
    encoding: 'utf-8',
    flag: 'w'
  })
  writeFileSync(join(basePath, `About${ext}`), aboutTSX, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const generateFiles = (isTS: boolean): void => {
  const ext = getExtension(isTS, true)
  const oldPath = toRootAbsolute('src', `main${ext}`)
  const basePage = toRootAbsolute('src', 'pages')
  if (!existsSync(basePage)) {
    mkdirSync(basePage)
  }
  const fns = [
    generateServerConfig(toRootAbsolute('src', `entry-server${ext}`), isTS),
    rewriteClientConfig(oldPath),
    rewriteIndexHTML(toRootAbsolute('index.html'), ext),
    generatePages(basePage, ext),
    rewriteAppTSX(toRootAbsolute('src', `app${ext}`), isTS)
  ]
  fns.forEach((fn) => fn())

  renameClientConfig(oldPath, toRootAbsolute('src', `entry-client${ext}`))()
}

export { generateFiles }