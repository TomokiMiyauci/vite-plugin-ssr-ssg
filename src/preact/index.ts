import type { StaticRouterContext } from 'react-router'
import renderToString from 'preact-render-to-string'

export { getRoutes } from './routes'

type ServerRenderer = (
  url: string,
  context: StaticRouterContext
) => Promise<ReturnType<typeof renderToString>>

export type { ServerRenderer }
