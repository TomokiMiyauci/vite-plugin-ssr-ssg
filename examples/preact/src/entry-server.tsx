import { App } from './app'
import renderToString from 'preact-render-to-string'
import { ServerRenderer } from 'vite-plugin-ssr-ssg'

const render: ServerRenderer = async (url, manifest) => {
  const bodyTags = renderToString(<App url={url} />)
  return { bodyTags }
}

export default render
