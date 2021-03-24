import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import plugin from 'vite-plugin-ssr-ssg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    plugin({
      generate: {
        routes: async () => {
          return ['/1']
        }
      }
    })
  ]
})
