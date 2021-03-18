import { RouteComponent, RouteRecordRaw } from 'vue-router'

const getRoutes = (
  pages: Record<
    string,
    {
      [key: string]: RouteComponent
    }
  >,
  key = 'default'
): RouteRecordRaw[] =>
  Object.entries(pages).map(([path, fn]) => {
    const fileName = path.split('/').slice(-1)[0]
    const name = fileName.split('.')[0]

    return {
      name,
      path: name === 'Index' ? '/' : `/${name?.toLowerCase()}`,
      component: fn[key]
    }
  })

export { getRoutes }
