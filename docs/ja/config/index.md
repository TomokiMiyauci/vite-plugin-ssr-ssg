## Why vite-plugin-ssr-ssg

### The motivation

It all started when I wanted to use `vite` to create a static site such as a blog. The overwhelming speed that static site generators haven't had has made me irreversible to other tools.

There are few tools for doing SSR and SSG with Vite. However, in most cases, it provides only wrapper functions and commands and is so abstract that you don't know what's going on inside. This is good for achieving a particular purpose, but it's confusing to customize and feels a bit overkill.

On the other hand, in this project aim for a simpler and easier-to-understand structure.

Client-side and server-side entry points are not intentionally hidden and are forced to declare. This is due to the fact that common parts are not yet been found between frameworks to support cross-framework. Of course, the entry point can be overridden and aim to make it nonexistent by default.
Instead of reducing the level of abstraction, provide a script that makes it easy to set up your project with `vite-ssrg init`.

## Release Notes

Latest version: ![npm](https://img.shields.io/npm/v/vite-plugin-ssr-ssg)

Detailed release notes for each version are available on [GitHub](https://github.com/TomokiMiyauci/vite-plugin-ssr-ssg/blob/main/CHANGELOG.md).

## Getting Started

with Yarn

```bash
yarn add -D vite-plugin-ssr-ssg
```

with NPM

```bash
npm i -D vite-plugin-ssr-ssg
```

### Quick start

vite-plugin-ssr-ssg provides initialize command. If you

In your vite project:

```bash
npx run vite-ssrg init
or
yarn vite-ssrg init
```

## Commands

`vite-ssrg [command]`

| Command  | Description                                       |
| -------- | ------------------------------------------------- |
| init     | Setup SSR and SSG development environment         |
| dev      | Setup SSR develop server                          |
| build    | Output client side code and server side code      |
| generate | Output pre-rendered client side code              |
| preview  | Setup node server for builded or generated output |

## Entrypoint

> エントリーポイントは将来的に不要になる可能性があります。

Server Side でレンダリングした結果を置き換えるために、`index.html`には`<!--app-html-->`というプレースホルダーを用意する必要があります。

index.html

```html
<body>
  <div id="app"><!--app-html--></div>
  <script type="module" src="/src/entry-client.tsx"></script>
</body>
```

### Client Side

Client Side のエントリーポイントは、`index.html`の`<script type="module" />`で指定します。
また、Client Side では、ハイドレーション用のレンダリング関数を呼び出す必要があります。

**React**

```tsx
import { hydrate } from 'react-dom'

hydrate(<App />, document.getElementById('app'))
```

**Vue**

```ts
createRouter()
  .isReady()
  .then(() => {
    app.mount('#app')
  })
```

### Server Side

`src/entry-server.(t|j)sx?`ファイルが必要です。そしてレンダラー関数を default export として公開する必要があります。

レンダラー関数のためのタイプディフィニションがあります。

```ts
type ServerRender = (
  url: string,
  manifest: Record<string, string[] | undefined>
) => Promise<{
  bodyTags: string
  headTags?: string
  htmlAttrs?: string
  bodyAttrs?: string
}>
```

**React**  
src/entry-server.tsx

```tsx
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import type { ServerRenderer } from 'vite-plugin-ssr-ssg'

const render: ServerRenderer = async (url, manifest) => {
  const headTags = [] as any
  const context = {} as { modules: Set<string> }

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
```

**Vue**  
src/entry-server.ts

```ts
import { ServerRenderer } from 'vite-plugin-ssr-ssg'
import { renderToString } from '@vue/server-renderer'
import { renderHeadToString } from '@vueuse/head'

const render: ServerRenderer = async (url, manifest) => {
  const { app, router, head } = createApp() // app factory

  router.push(url)
  await router.isReady()

  const context = {} as { modules: Set<string> }
  const html = await renderToString(app, context)
  const { headTags, htmlAttrs, bodyAttrs } = renderHeadToString(head)

  return {
    bodyTags: html,
    headTags,
    htmlAttrs,
    bodyAttrs
  }
}

export default render
```

default export の戻り値は、最終的に`index.html`で次のようにレンダリングされます。

```html
<!DOCTYPE html>
<html>
  <head ${headTags}>
    <>Other tags</>
    ${headTags}
  </head>
  <body ${bodyAttrs}>
    <div id="app"><!--app-html--> -> ${bodyTags}</div>
  </body>
</html>
```

## API

Named exports has JavaScript API.

### JavaScript API

Vite's JavaScript APIs are fully typed, and it's recommended to use TypeScript or enable JS type checking in VSCode to leverage the intellisense and validation.

#### `getRoutes`

Helper for getting routes.

**Type Signature**

```ts
const getRoutes: <T extends Framework>(
  pages: Record<
    string,
    {
      [key: string]: any
    }
  >,
  routeOptions?: Partial<RouteOptions> | undefined
) => Route<T>[]
```

#### Example Usage

**React**

```ts
import { Route, Switch } from 'react-router-dom'
import { getRoutes } from 'vite-plugin-ssr-ssg'

const pages = import.meta.globEager('./pages/**/*.tsx')
const routes = getRoutes<'react'>(pages)
// {
  name: string,
  path: string,
  Component: React.ComponentType
}[]

() => <Switch>
  {routes.map(({ path, name, Component }) => {
    return (
      <Route exact path={path} key={name}>
        <Component />
      </Route>
    )
  })}
</Switch>
```

**Vue3**

```ts
import { createRouter } from 'vue-router'
import { getRoutes } from 'vite-plugin-ssr-ssg'

const pages = import.meta.globEager('./pages/**/*.vue')
const routes = getRoutes<'vue'>(pages)
// RouteRecordRaw[]
const router = createRouter({
  routes
})
```
