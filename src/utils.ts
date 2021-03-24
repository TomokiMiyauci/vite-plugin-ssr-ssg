import { PIPED_EXTENSIONS } from './constants'
import { bracketRegex } from './vue3/routes'
import { resolve, basename, dirname, join } from 'path'
import recursive from 'recursive-readdir'

const toRootAbsolute = (...path: string[]): string =>
  resolve(process.env.PWD || '', ...path)

const extensions = new RegExp(`.(${PIPED_EXTENSIONS})$`)

const path2Absolute = (path: string, baseDir: string): string => {
  const matched = path.match(new RegExp(`${baseDir}/(.+)`))
  if (!matched || !matched[1]) {
    return path
  }
  return matched[1]
}

const getPath = (fileName: string): string => {
  const name = fileName.replace(extensions, '').replace('index', '')
  return removeEndSlash(join('/', name))
}

const getExtension = (isTS: boolean, x?: boolean): string => {
  const _x = x ? 'x' : ''
  return isTS ? `.ts${_x}` : `.js${_x}`
}

const getRoutePaths = async (): Promise<string[]> => {
  const pageFileNames = await (
    await recursive(toRootAbsolute('src', 'pages'))
  ).map((path) => path2Absolute(path, 'pages'))
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

const ext = '.html'

const toIndexHTML = (path: string): string => {
  if (
    !new RegExp(`${ext}$`).test(path) ||
    new RegExp(`index${ext}$`).test(path)
  ) {
    return path
  }
  const _dirname = dirname(path)
  const fileName = basename(path, ext)
  return join(_dirname, fileName, `index${ext}`)
}

const startWith = (searchString: string) => (
  val: string,
  position?: number | undefined
): boolean => val.startsWith(searchString, position)

const endWith = (searchString: string) => (
  val: string,
  position?: number | undefined
): boolean => val.endsWith(searchString, position)

const startWithSlash = startWith('/')
const endWithSlash = endWith('/')
const addStartSlash = (val: string): string =>
  startWithSlash(val) ? val : `/${val}`
const removeEndSlash = (val: string): string =>
  val.length > 1 && endWithSlash(val) ? val.slice(0, -1) : val
const removeDuplicate = <T extends string | number>(val: readonly T[]): T[] => [
  ...new Set(val)
]

export {
  getRoutePaths,
  toRootAbsolute,
  getExtension,
  renderPreloadLinks,
  toIndexHTML,
  startWithSlash,
  addStartSlash,
  endWithSlash,
  removeEndSlash,
  removeDuplicate,
  path2Absolute
}
