import { renderToString } from '@vue/server-renderer'

export { getRoutes } from './routes'

type ServerRenderer = (
  url: string,
  context: any
) => Promise<ReturnType<typeof renderToString>>

export type { ServerRenderer }
