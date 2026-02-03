import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  base: '/clearup/',
  plugins: [
    vue(),
    vueDevTools(),
    nodePolyfills({
      // Enable polyfills for Node.js built-in modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Polyfill specific modules
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  define: {
    'process.env': {},
  },
})
