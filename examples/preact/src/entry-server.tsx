import { App } from './app'
import renderToString from 'preact-render-to-string'
import { createElement } from 'preact'
import { ServerRenderer } from 'vite-plugin-ssr-ssg/preact'

const render: ServerRenderer = async (
  url,
  context
): Promise<ReturnType<typeof renderToString>> => {
  const app = createElement(App, { url })

  return renderToString(app)
}

export default render
