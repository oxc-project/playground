import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
    // Suppress the warning: The file does not exist at "oxc-playground/node_modules/.vite/deps/@oxc-parser/binding-wasm32-wasi/wasi-worker-browser.mjs?worker_file&type=module" which is in the optimize deps directory. The dependency might be incompatible with the dep optimizer. Try adding it to `optimizeDeps.exclude`.
    // Need to resolve
    exclude: ['@oxc-parser/binding-wasm32-wasi'],
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: [__dirname, '../oxc/npm/oxc-wasm'],
    },
  },
  plugins: [
    Vue(),
    UnoCSS(),
    {
      name: 'configure-response-headers',
      enforce: 'pre',
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
          next()
        })
      },
    },
  ],
})
