import { Plugin } from 'vite'
import { NAME } from './constants'
export type { Render as ServerRenderer } from './types'
export { getRoutes } from './routes'
import type { PluginOptions } from './types'

declare module 'vite' {
  interface UserConfig {
    ssrgOptions?: Partial<PluginOptions>
  }
}

const plugin = (config?: Partial<PluginOptions>): Plugin => {
  return {
    config: (userConfig) => {
      userConfig.ssrgOptions = config
    },
    name: NAME
  }
}

export { renderPreloadLinks } from './utils'
export default plugin
