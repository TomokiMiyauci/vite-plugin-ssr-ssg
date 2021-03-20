export const entryClient = `import React from 'react'
import { hydrate } from 'react-dom'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

hydrate(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)
`

const entryServer = (isTS: boolean): string => `import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
${
  isTS
    ? "import type { ServerRenderer } from 'vite-plugin-ssr-ssg/react'\n"
    : ''
}
const render${isTS ? ': ServerRenderer' : ''} = async (
  url,
  context
) => {
  const app = React.createElement(
    StaticRouter,
    {
      location: url,
      context
    },
    React.createElement(App)
  )

  return renderToString(app)
}

export default render
`

export const indexTSX = `import React from 'react'
const Index = () => <div>Home</div>
export default Index
`

export const aboutTSX = `import React from 'react'
const About = () => <div>About</div>
export default About
`

const appTSX = (isTS: boolean): string => `import React${
  isTS ? ', { FC }' : ''
} from 'react'
import './App.css'
import { Route, Switch, Link } from 'react-router-dom'
import { getRoutes } from 'vite-plugin-ssr-ssg/react'

const pages = import.meta.globEager('./pages/*.${isTS ? 'tsx' : 'jsx'}')
const routes = getRoutes(pages)

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
