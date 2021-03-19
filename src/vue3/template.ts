const entryServer = (
  isTS: boolean
): string => `import { createApp } from './entry-client'
${isTS ? "import { ServerRenderer } from 'vite-plugin-ssr-ssg/vue3'" : ''}
import { renderToString } from '@vue/server-renderer'

const render${isTS ? ': ServerRenderer' : ''} = async (url, context) => {
  const { app, router } = createApp()

  router.push(url)
  await router.isReady()

  return renderToString(app, context)
}

export { render }
`

const type = `: {
  app: app<Element>
  router: Router
}`

const entryClient = (isTS: boolean): string => `import App from './App.vue'
import { createSSRApp${isTS ? ', App as app' : ''} } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory${isTS ? ',\n  Router' : ''}
} from 'vue-router'
import { getRoutes } from 'vite-plugin-ssr-ssg/vue3'

const pages = import.meta.globEager('./pages/*.vue')
const routes = getRoutes(pages)

export const createApp = ()${isTS ? type : ''} => {
  const app = createSSRApp(App)
  const router = createRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes
  })
  app.use(router)
  return { app, router }
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

<script setup ${isTS ? 'lang="ts"' : ''}>
import { ref } from 'vue'

const count = ref(0)
</script>
`

export { entryClient, entryServer, indexVue }

export const aboutVue = `<template>
  <div>
    <router-link to="/">Home</router-link>

    <h1>About</h1>
    <p>This is about page.</p>
  </div>
</template>
`

export const appVue = `<template>
  <router-view />
</template>
`
