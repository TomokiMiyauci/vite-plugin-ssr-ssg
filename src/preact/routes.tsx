import { ComponentType } from 'preact'

type GetRoutes = {
  name: string
  path: string
  Component: ComponentType
}

const getRoutes = (
  pages: Record<
    string,
    {
      [key: string]: ComponentType
    }
  >,
  key = 'default'
): GetRoutes[] =>
  Object.entries(pages).map(([path, fn]) => {
    const fileName = path.split('/').slice(-1)[0]
    const name = fileName.split('.')[0]

    return {
      name,
      path: name === 'Index' ? '/' : `/${name?.toLowerCase()}`,
      Component: fn[key]
    }
  })

export { getRoutes }
