import { toRootAbsolute } from '../utils'
import { lazy, Suspense } from 'react'

const pages = import.meta.glob(toRootAbsolute('src', 'pages', '*.tsx'))
const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1]
  const Page = lazy(pages[path] as any)

  return {
    name,
    path: name === 'Index' ? '/' : `/${name?.toLowerCase()}`,

    Component: () => (
      <Suspense fallback={<></>}>
        <Page />
      </Suspense>
    )
  }
})

export { routes }
