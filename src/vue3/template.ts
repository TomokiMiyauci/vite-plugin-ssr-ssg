const entryServer = (
  isTS: boolean
): string => `import { createApp } from './entry-client'
${isTS ? "import { ServerRenderer } from 'vite-plugin-ssr-ssg'" : ''}
import { renderToString } from '@vue/server-renderer'
import { renderHeadToString } from '@vueuse/head'

const render${isTS ? ': ServerRenderer' : ''} = async (url, manifest) => {
  const { app, router, head } = createApp()

  router.push(url)
  await router.isReady()

  const context = {}${isTS ? ' as { modules: Set<string> }' : ''}
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
`

const type = `: {
  app: app<Element>
  router: Router
  head: HeadClient
}`

const entryClient = (isTS: boolean): string => `import App from './App.vue'
import { createSSRApp${isTS ? ', App as app' : ''} } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory${isTS ? ',\n  Router' : ''}
} from 'vue-router'
import { getRoutes } from 'vite-plugin-ssr-ssg'
import { createHead${isTS ? ', HeadClient' : ''} } from '@vueuse/head'

const pages = import.meta.globEager('./pages/*.vue')
const routes = getRoutes${isTS ? "<'vue'>" : ''}(pages)

export const createApp = ()${isTS ? type : ''} => {
  const app = createSSRApp(App)
  const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  })
  const head = createHead()
  app.use(router).use(head)
  return { app, router, head }
}

const { app, router } = createApp()

router.isReady().then(() => {
  app.mount('#app')
})
`

const indexVue = (isTS: boolean): string => `<template>
  <div>
    <router-link to="/about">About</router-link>

    <h1>Index</h1>
    <p>This is Home page</p>
    <button @click="count++">{{ count }}</button>
  </div>
</template>

<script setup${isTS ? ' lang="ts"' : ''}>
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Index'
})

const count = ref(0)
</script>
`

export { entryClient, entryServer, indexVue }

export const aboutVue = (isTS: boolean): string => `<template>
  <div>
    <router-link to="/">Home</router-link>

    <h1>About</h1>
    <p>This is about page.</p>
  </div>
</template>

<script setup${isTS ? ' lang="ts"' : ''}>
import { useHead } from '@vueuse/head'

useHead({
  title: 'About'
})
</script>
`

export const appVue = `<template>
  <router-view />
</template>
`
