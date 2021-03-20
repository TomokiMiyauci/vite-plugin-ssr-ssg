import { FunctionComponent } from 'preact'
import { Link, Router } from 'preact-router'
import { getRoutes } from 'vite-plugin-ssr-ssg/preact'

const pages = import.meta.globEager('./pages/*.tsx')
const routes = getRoutes(pages)

export const App: FunctionComponent<{ url?: string }> = ({ url }) => {
  return (
    <>
      <nav>
        <Link href="/">/</Link>
        <Link href="/about">about</Link>
      </nav>

      <Router url={url}>
        {routes.map(({ path, name, Component }) => (
          <Component path={path} key={name} />
        ))}
      </Router>
    </>
  )
}
