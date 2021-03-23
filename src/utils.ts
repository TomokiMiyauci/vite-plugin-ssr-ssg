import { resolve } from 'path'
import { readdirSync } from 'fs'
import { PIPED_EXTENSIONS } from './constants'
import { bracketRegex } from './vue3/routes'

const toRootAbsolute = (...path: string[]): string =>
  resolve(process.env.PWD || '', ...path)

const extensions = new RegExp(`.(${PIPED_EXTENSIONS})$`)

const getPath = (fileName: string): string => {
  const name = fileName.replace(extensions, '').toLowerCase()
  return name === 'index' ? '/' : `/${name}`
}

const getExtension = (isTS: boolean, x?: boolean): string => {
  const _x = x ? 'x' : ''
  return isTS ? `.ts${_x}` : `.js${_x}`
}

const getRoutePaths = (): string[] => {
  const pageFileNames = readdirSync(toRootAbsolute('src', 'pages'))
  const routePaths = pageFileNames
    .filter((page) => extensions.test(page) && !bracketRegex.test(page))
    .map((page) => getPath(page))
  return routePaths
}

const renderPreloadLinks = (
  modules: Set<string>,
  manifest: Record<string, string[] | undefined>
): string => {
  const links = [...modules]
    .map((id) => {
      const files = manifest[id]
      if (!!files && files.length) {
        return files.map((file) => renderPreloadLink(file))
      } else return ''
    })
    .flat()
    .filter((link) => !!link)
  return [...new Set(links)].join()
}

const renderPreloadLink = (file: string): string => {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else {
    return ''
  }
}

export { getRoutePaths, toRootAbsolute, getExtension, renderPreloadLinks }
