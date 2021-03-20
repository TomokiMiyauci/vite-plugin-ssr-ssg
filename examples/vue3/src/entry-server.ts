import { createApp } from './entry-client'
import { ServerRenderer } from 'vite-plugin-ssr-ssg/vue3'
import { renderToString } from '@vue/server-renderer'

const render: ServerRenderer = async (url, context) => {
  const { app, router } = createApp()

  router.push(url)
  await router.isReady()

  return renderToString(app, context)
}

export default render
