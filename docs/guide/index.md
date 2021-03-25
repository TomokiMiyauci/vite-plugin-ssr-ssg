---
head:
  - - link
    - rel: canonical
      href: https://vite-plugin-ssr-ssg.web.app/guide
  - - link
    - rel: alternate
      hreflang: en
      href: https://vite-plugin-ssr-ssg.web.app/guide
  - - link
    - rel: alternate
      hreflang: x-default
      href: https://vite-plugin-ssr-ssg.web.app/guide
---

## Why vite-plugin-ssr-ssg

### The motivation

It all started when I wanted to use `vite` to create a static site such as a blog. The overwhelming speed that static site generators haven't had has made me irreversible to other tools.

There are few tools for doing SSR and SSG with Vite. However, in most cases, it provides only wrapper functions and commands and is so abstract that you don't know what's going on inside. This is good for achieving a particular purpose, but it's confusing to customize and feels a bit overkill.

On the other hand, in this project aim for a simpler and easier-to-understand structure.

Client-side and server-side entry points are not intentionally hidden and are forced to declare. This is due to the fact that common parts are not yet been found between frameworks to support cross-framework. Of course, the entry point can be overridden and aim to make it nonexistent by default.
Instead of reducing the level of abstraction, provide a script that makes it easy to set up your project with `vite-ssrg init`.

## Release Notes

Latest version: ![npm](https://img.shields.io/npm/v/vite-plugin-ssr-ssg?color=black)

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

That's all.

Refer to [examples](https://github.com/TomokiMiyauci/vite-plugin-ssr-ssg/tree/main/examples) for manual setup.

## Commands

`vite-ssrg [command]`

| Command  | Description                                       |
| -------- | ------------------------------------------------- |
| init     | Setup SSR and SSG development environment         |
| dev      | Setup SSR develop server                          |
| build    | Output client side code and server side code      |
| generate | Output pre-rendered client side code.             |
| preview  | Setup node server for builded or generated output |

## Entrypoint

> Entry points may no longer be needed in the future.

You need to have a placeholder `<!-App-html->` in `index.html` to replace the result rendered in Server Side.

**index.html**

```html
<body>
  <div id="app"><!--app-html--></div>
  <script type="module" src="/src/entry-client.tsx"></script>
</body>
```

### Client Side

The Client Side entry point is specified by `<script type =" module "/>` in `index.html`.
Also, on the Client Side, you need to call the rendering function for hydration.

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

You need the `src/entry-server.(t|j)sx?` File. And you need to expose the renderer function as default export.

There is a type definition for the renderer function.

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

The return value of default export is finally rendered in `index.html` as follows:

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

### Page generation

The files under `src/pages` are automatically used to generate static sites. At that time, it is recognized as `Path` according to the following rules.

| File Name       | Path           |
| --------------- | -------------- |
| index.\*        | `/`            |
| [param].\*      | `/param`       |
| nested/index.\* | `/nested`      |
| nested/page.\*  | `/nested/page` |

Also, if you want to generate routes with dynamic parameters, see [generate.routes](./../config/index.md#generate-routes).

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

Return value:
| key | name | path |
| --------------- | ------------- | -------------- | ------------ |
| index.\* | `index` | `/` |
| [param].\* | `param` | `/:param` |
| nested/index.\* | `nested` | `/nested` |
| nested/page.\* | `nested-page` | `/nested/page` |

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
