import { renderToString } from 'react-dom/server'
import type { StaticRouterContext } from 'react-router'

export { getRoutes } from './routes'
export { generateFiles } from './init'
type ServerRenderer = (
  url: string,
  context: StaticRouterContext
) => Promise<ReturnType<typeof renderToString>>

export type { ServerRenderer }
