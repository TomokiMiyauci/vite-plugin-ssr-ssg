import { Plugin } from 'vite'
import { NAME } from './constants'
export type { Render as ServerRenderer } from './types'
import type { PluginOptions } from './types'

declare module 'vite' {
  interface UserConfig {
    ssrgOptions?: PluginOptions
  }
}

const plugin = (config: PluginOptions): Plugin => {
  return {
    config: (userConfig) => {
      userConfig.ssrgOptions = config
      return userConfig
    },
    name: NAME
  }
}

export { renderPreloadLinks } from './utils'
export default plugin
