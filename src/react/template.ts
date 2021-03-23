export const entryClient = `import React from 'react'
import { hydrate } from 'react-dom'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HeadProvider } from 'react-head'
import App from './App'

hydrate(
  <StrictMode>
    <HeadProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>,
  document.getElementById('root')
)
`

const entryServer = (isTS: boolean): string => `import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
${isTS ? "import type { ServerRenderer } from 'vite-plugin-ssr-ssg'\n" : ''}
import { HeadProvider } from 'react-head'

const render${isTS ? ': ServerRenderer' : ''} = async (url, manifest) => {
  const headTags = []${isTS ? ' as any' : ''}
  const context = {}

  const body = renderToString(
    <HeadProvider headTags={headTags}>
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>
    </HeadProvider>
  )

  return { bodyTags: body, headTags: renderToString(headTags) }
}

export default render
`

export const indexTSX = `import React from 'react'
import { Title } from 'react-head'

const Index = () => (
  <div>
    <h1>Home</h1>

    <Title>Home</Title>
  </div>
)
export default Index
`

export const aboutTSX = `import React from 'react'
import { Title } from 'react-head'

const About = () => (
  <div>
    <h1>About</h1>

    <Title>About</Title>
  </div>
)
export default About
`

const appTSX = (isTS: boolean): string => `import React${
  isTS ? ', { FC }' : ''
} from 'react'
import './App.css'
import { Route, Switch, Link } from 'react-router-dom'
import { getRoutes } from 'vite-plugin-ssr-ssg'

const pages = import.meta.globEager('./pages/*.${isTS ? 'tsx' : 'jsx'}')
const routes = getRoutes${isTS ? "<'react'>" : ''}(pages)

const App${isTS ? ': FC' : ''} = () => {
  return (
    <div className="App">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        {routes.map(({ path, name, Component }) => {
          return (
            <Route exact path={path} key={name}>
              <Component />
            </Route>
          )
        })}
      </Switch>
    </div>
  )
}

export default App
`

export { entryServer, appTSX }
