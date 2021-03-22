import { Plugin } from 'vite'
import { NAME } from './constants'
export type { Render as ServerRenderer } from './types'

const plugin = (): Plugin => ({
  name: NAME
})

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

export { renderPreloadLinks }
export default plugin
