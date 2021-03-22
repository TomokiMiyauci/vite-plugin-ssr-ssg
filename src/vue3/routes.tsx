import { RouteComponent, RouteRecordRaw } from 'vue-router'

const bracketRegex = /\[.+\]\..+/

const path2RouteObject = (
  path: string
): {
  name: string
  path: string
} => {
  const fileName = path.split('/').slice(-1)[0]
  const isDynamicPath = bracketRegex.test(fileName)
  const name = isDynamicPath
    ? fileName.split('.')[0].replace(/\[/, '').replace(/\]/, '')
    : fileName.split('.')[0]
  const _path = isDynamicPath
    ? `/:${name}`
    : name.toLowerCase() === 'index'
    ? '/'
    : `/${name?.toLowerCase()}`

  return {
    name,
    path: _path
  }
}

const getRoutes = (
  pages: Record<
    string,
    {
      [key: string]: RouteComponent
    }
  >,
  module = 'default'
): RouteRecordRaw[] =>
  Object.entries(pages).map(([path, fn]) => {
    const { name, path: _path } = path2RouteObject(path)

    return {
      name,
      path: _path,
      component: fn[module]
    }
  })

export { getRoutes, path2RouteObject, bracketRegex }
