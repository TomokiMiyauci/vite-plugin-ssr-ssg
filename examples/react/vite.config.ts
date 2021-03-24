import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import ssrgPlugin from 'vite-plugin-ssr-ssg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    ssrgPlugin({
      generate: {
        routes: ['/1']
      }
    })
  ]
})
