import { renderToString, SSRContext } from '@vue/server-renderer'

export { getRoutes } from './routes'
export { generateFiles } from './init'

type ServerRenderer = (
  url: string,
  context: SSRContext
) => ReturnType<typeof renderToString>

export type { ServerRenderer }
