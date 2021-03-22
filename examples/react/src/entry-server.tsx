import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import type { ServerRenderer } from 'vite-plugin-ssr-ssg'

import { HeadProvider } from 'react-head'

const render: ServerRenderer = async (url, manifest) => {
  const headTags = [] as any
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
