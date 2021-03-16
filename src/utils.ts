import { resolve } from 'path'
import { readdirSync } from 'fs'
import { PIPED_EXTENSIONS, isTest } from './constants'
import { ViteDevServer } from 'vite'

const toRootAbsolute = (...path: string[]): string =>
  resolve(process.env.PWD || '', ...path)

const extensions = new RegExp(`.(${PIPED_EXTENSIONS})$`)

const getPath = (fileName: string): string => {
  const name = fileName.replace(extensions, '').toLowerCase()
  return name === 'index' ? '/' : `/${name}`
}

const getRoutePaths = (): string[] => {
  const pageFileNames = readdirSync(toRootAbsolute('src', 'pages'))
  const routePaths = pageFileNames
    .filter((page) => extensions.test(page))
    .map((page) => getPath(page))
  return routePaths
}

const getViteInstance = async <T extends boolean>(
  isProd: T,
  root: string
): Promise<ViteDevServer | undefined> => {
  if (isProd) return undefined

  return await (await import('vite')).createServer({
    root,
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: true
    }
  })
}

export { getRoutePaths, toRootAbsolute, getViteInstance }
