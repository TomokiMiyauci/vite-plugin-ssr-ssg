import { resolve } from 'path'
import { readdirSync } from 'fs'
import { PIPED_EXTENSIONS } from './constants'

const toRootAbsolute = (...path: string[]): string =>
  resolve(process.env.PWD || '', ...path)

const extensions = new RegExp(`.(${PIPED_EXTENSIONS})$`)

const getPath = (fileName: string): string => {
  const name = fileName.replace(extensions, '').toLowerCase()
  console.log(fileName, name)
  return name === 'index' ? '/' : `/${name}`
}

const getRoutePaths = (): string[] => {
  const pageFileNames = readdirSync(toRootAbsolute('src', 'pages'))
  const routePaths = pageFileNames
    .filter((page) => extensions.test(page))
    .map((page) => getPath(page))
  return routePaths
}

export { getRoutePaths, toRootAbsolute }
