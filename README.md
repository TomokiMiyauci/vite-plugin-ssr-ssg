<div align="center">
  <img width="180" src="./docs/public/logo.png" alt="vite-plugin-ssr-ssg logo">

![version](https://img.shields.io/npm/v/vite-plugin-ssr-ssg)
![downloads](https://img.shields.io/npm/dw/vite-plugin-ssr-ssg?color=blue)
![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)
![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat)
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)
![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

</div>

# vite-plugin-ssr-ssg

> Vite plugin for SSR and SSG in cross framework

**:rotating_light: It has not been fully tested and should not be used in production.  
A better alternative is [vite-plugin-ssr](https://github.com/brillout/vite-plugin-ssr).**

## ✨ Feature

- Declarative entry point
- Simple commands that work with cross frameworks
- Convenient setup script
- Automatic page generation
- Preview in SSR and CSR

[📝 Read the Docs to Learn More.](https://vite-plugin-ssr-ssg.web.app/)

## 💫 Quick start

In your vite project

```bash
yarn add -D vite-plugin-ssr-ssg
yarn vite-ssrg init
```

## ☘️ Support

The support status of the framework is as follows.

- [x] React
- [x] Peact
- [x] Vue
- [ ] Svelte
- [ ] lit-element
- [ ] vanilla

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
