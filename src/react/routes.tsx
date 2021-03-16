import { lazy, ComponentType } from 'react'

const pages = import.meta.glob('../../src/pages/*.tsx')
const routes = Object.keys(pages)
  .filter((page) => /.+\.(tsx?|jsx?)(\?v=[a-z0-9]+)?$/.test(page))
  .map((path) => {
    const fileName = path.split('/').slice(-1)[0]
    const name = fileName.split('.')[0]
    const Page = lazy(
      pages[path] as () => Promise<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        default: ComponentType<any>
      }>
    )

    return {
      name,
      path: name === 'Index' ? '/' : `/${name?.toLowerCase()}`,

      Component: Page
    }
  })

export { routes }
