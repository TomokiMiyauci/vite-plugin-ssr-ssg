const entryClient = (isTS: boolean): string => `import { hydrate } from 'preact'
import { App } from './app'
import './index.css'

hydrate(<App />, document.getElementById('app')${isTS ? '!' : ''})
`

const entryServer = (isTS: boolean): string => `import { App } from './app'
import renderToString from 'preact-render-to-string'
import { createElement } from 'preact'
${isTS ? "import { ServerRenderer } from 'vite-plugin-ssr-ssg/preact'\n" : ''}
const render${isTS ? ': ServerRenderer' : ''} = async (
  url,
  context
)${isTS ? ': Promise<ReturnType<typeof renderToString>>' : ''} => {
  const app = createElement(App, { url })

  return renderToString(app)
}

export default render
`

export const indexTSX = `const Index = () => <div>Home</div>
export default Index
`

export const aboutTSX = `const About = () => <div>About</div>
export default About
`

const appTSX = (isTS: boolean): string => `${
  isTS ? "import { FunctionComponent } from 'preact'\n" : ''
}import { Link, Router } from 'preact-router'
import { getRoutes } from 'vite-plugin-ssr-ssg'

const pages = import.meta.globEager('./pages/**/*.${isTS ? 'tsx' : 'jsx'}')
const routes = getRoutes${isTS ? "<'preact'>" : ''}(pages)

export const App${
  isTS ? ': FunctionComponent<{ url?: string }>' : ''
} = ({ url }) => {
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
`

export { entryClient, entryServer, appTSX }
