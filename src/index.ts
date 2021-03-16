import { Plugin } from 'vite'
import { NAME } from './constants'

const plugin = (): Plugin => ({
  name: NAME
})

export default plugin
