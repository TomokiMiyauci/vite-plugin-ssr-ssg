import { lazy, ComponentType, LazyExoticComponent } from 'react'

type GetRoutes = {
  name: string
  path: string
  Component: LazyExoticComponent<ComponentType<any>>
}

const getRoutes = (
  pages: Record<
    string,
    () => Promise<{
      [key: string]: any
    }>
  >
): GetRoutes[] => {
  return Object.keys(pages).map((path) => {
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
}

export { getRoutes }
