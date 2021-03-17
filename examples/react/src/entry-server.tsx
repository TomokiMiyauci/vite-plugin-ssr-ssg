import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import ssrPrepass from 'react-ssr-prepass'
import type { ServerRenderer } from 'vite-plugin-ssr-ssg/react'

const render: ServerRenderer = async (url, context) => {
  const app = React.createElement(
    StaticRouter,
    {
      location: url,
      context
    },
    React.createElement(App)
  )

  await ssrPrepass(app)
  return renderToString(app)
}

export { render }
