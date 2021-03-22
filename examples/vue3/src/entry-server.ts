import { createApp } from './entry-client'
import { ServerRenderer } from 'vite-plugin-ssr-ssg'
import { renderToString } from '@vue/server-renderer'
import { renderHeadToString } from '@vueuse/head'

const render: ServerRenderer = async (url, manifest) => {
  const { app, router, head } = createApp()

  router.push(url)
  await router.isReady()

  const context = {} as { modules: Set<string> }
  const html = await renderToString(app, context)

  // const preloadLinks = renderPreloadLinks(context.modules, manifest)
  const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  return {
    bodyTags: html,
    headTags,
    htmlAttrs,
    bodyAttrs
  }
}

export default render
