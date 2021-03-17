import { renderToString } from 'react-dom/server'
import type { StaticRouterContext } from 'react-router'

const pages = import.meta.glob('./src/pages/*.tsx')

export { getRoutes } from './routes'
type ServerRenderer = (
  url: string,
  context: StaticRouterContext
) => Promise<ReturnType<typeof renderToString>>

export { pages }
export type { ServerRenderer }
