import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import type { StaticRouterContext } from 'react-router'
import App from './App'

const render = (
  url: string,
  context: StaticRouterContext
): ReturnType<typeof renderToString> => {
  return renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  )
}

export { render }
