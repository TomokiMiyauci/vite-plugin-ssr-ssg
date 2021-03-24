import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import ssrgPlugin from 'vite-plugin-ssr-ssg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    ssrgPlugin({
      generate: {
        routes: ['users/1']
      }
    })
  ]
})
