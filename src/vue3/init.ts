const entryServer = `import { createApp } from './entry-client'
import { ServerRenderer } from 'vite-plugin-ssr-ssg/vue3'
import { renderToString } from '@vue/server-renderer'

const render: ServerRenderer = async (url, context) => {
  const { app, router } = createApp()

  router.push(url)
  await router.isReady()

  return renderToString(app, context)
}

export { render }
`

const entryClient = `import App from './App.vue'
import { createSSRApp, App as app } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  Router
} from 'vue-router'
import { getRoutes } from 'vite-plugin-ssr-ssg/vue3'

const pages = import.meta.globEager('./pages/*.vue')
const routes = getRoutes(pages)

export const createApp = (): {
  app: app<Element>
  router: Router
} => {
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

const indexVue = `<template>
  <div>
    <router-link to="/about">About</router-link>

    <h1>Index</h1>
    <p>This is Home page</p>
    <button @click="count++">{{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
`

const aboutVue = `<template>
  <div>
    <router-link to="/">Home</router-link>

    <h1>About</h1>
    <p>This is about page.</p>
  </div>
</template>
`

const appVue = `<template>
  <router-view />
</template>
`

import {
  writeFileSync,
  renameSync,
  readFileSync,
  existsSync,
  mkdirSync
} from 'fs'
import { join } from 'path'

const generateServerConfig = (path: string) => () => {
  writeFileSync(path, entryServer, {
    encoding: 'utf-8',
    flag: 'w'
  })
}
const rewriteClientConfig = (path: string) => () => {
  writeFileSync(path, entryClient, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const renameClientConfig = (oldPath: string, newPath: string) => () => {
  renameSync(oldPath, newPath)
}
const rewriteIndexHTML = (path: string) => () => {
  const index = readFileSync(path, { encoding: 'utf-8' })

  const replacedHTML = index
    .replace(/<div id="app"><\/div>/, '<div id="app"><!--app-html--></div>')
    .replace('src="/src/main.ts"', 'src="/src/entry-client.ts"')

  console.log(replacedHTML)

  writeFileSync(path, replacedHTML, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const rewriteAppVue = (path: string) => () => {
  writeFileSync(path, appVue, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

import { toRootAbsolute } from '../utils'

const generatePages = (basePath: string) => () => {
  writeFileSync(join(basePath, 'Index.vue'), indexVue, {
    encoding: 'utf-8',
    flag: 'w'
  })
  writeFileSync(join(basePath, 'About.vue'), aboutVue, {
    encoding: 'utf-8',
    flag: 'w'
  })
}

const generateFiles = () => {
  const oldPath = toRootAbsolute('src', 'main.ts')
  const basePage = toRootAbsolute('src', 'pages')
  if (!existsSync(basePage)) {
    mkdirSync(basePage)
  }
  const fns = [
    generateServerConfig(toRootAbsolute('src', 'entry-server.ts')),
    rewriteClientConfig(oldPath),
    rewriteIndexHTML(toRootAbsolute('index.html')),
    generatePages(basePage),
    rewriteAppVue(toRootAbsolute('src', 'App.vue'))
  ]
  fns.forEach((fn) => fn())

  renameClientConfig(oldPath, toRootAbsolute('src', 'entry-client.ts'))()
}

export { generateFiles }
