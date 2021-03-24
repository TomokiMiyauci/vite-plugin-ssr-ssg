# vite-plugin-ssr-ssg

![version](https://img.shields.io/npm/v/vite-plugin-ssr-ssg)
![downloads](https://img.shields.io/npm/dw/vite-plugin-ssr-ssg?color=blue)
![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)
![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> Vite plugin for SSR and SSG in cross framework

## ✨ Feature

- Declarative entry point
- Simple commands that work with cross frameworks
- Convenient setup script
- Automatic page generation
- Preview in SSR and CSR

The best feature is that it requires a declarative entry point, but it is easy to introduce (1 command).
This means that you can easily see what's happening and extend it, so you can incorporate it into your project and
understand how SSR and SSG are done.

## 💫 Usage

In your vite project

```bash
yarn add -D vite-plugin-ssr-ssg
yarn vite-ssrg init
```

This alone creates an environment for SSR and SSG. The framework and TS or JS are automatically detected.

Refer to [examples](./examples) for manual setup.

## 🛠️ Commands

`vite-ssrg [command]`

| Command  | Description                                       |
| -------- | ------------------------------------------------- |
| init     | Setup SSR and SSG development environment         |
| dev      | Setup SSR develop server                          |
| build    | Output client side code and server side code      |
| generate | Output pre-rendered client side code              |
| preview  | Setup node server for builded or generated output |

Maybe, JavaScript API will also be provided.

## ☘️ Support

The support status of the framework is as follows.

- [x] React
- [x] Peact
- [x] Vue
- [ ] Svelte
- [ ] lit-element
- [ ] vanilla

## ❓Why

It all started when I wanted to use `vite` to create a static site such as a blog. The overwhelming speed that static site generators haven't had has made me irreversible to other tools.

There are few tools for doing SSR and SSG with Vite. However, in most cases, it provides only wrapper functions and commands and is so abstract that you don't know what's going on inside. This is good for achieving a particular purpose, but it's confusing to customize and feels a bit overkill.

On the other hand, in this project aim for a simpler and easier-to-understand structure.

Client-side and server-side entry points are not intentionally hidden and are forced to declare. This is due to the fact that common parts are not yet been found between frameworks to support cross-framework. Of course, the entry point can be overridden and aim to make it nonexistent by default.
Instead of reducing the level of abstraction, provide a script that makes it easy to set up your project with `vite-ssrg init`.

## ✅ Todo

> Next channel is beta.

- [x] Auto detect dynamic routes and nested routes
- [x] Dynamic route generation via plugin config
- [ ] Head tag preload in development environment
- [ ] Page Async Loading
- [ ] Overall Unit test
- [ ] Support for the same CLI as Vite
- [ ] Svelte support

## 💚 Thanks

- [vite public examples](https://github.com/vitejs/vite/tree/main/packages/playground/ssr-vue)
- [vite-ssr](https://github.com/frandiox/vite-ssr)
- [vite-ssg](https://github.com/antfu/vite-ssg)

## License

[MIT](./LICENSE)
