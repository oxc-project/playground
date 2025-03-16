import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
    },
    // TODO: optimized linked dep needs restart with `--force` to pick up changes
    include: ['oxc-playground'],
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    fs: {
      // allow: [__dirname, '../oxc/npm/oxc-wasm'],
      allow: [__dirname, '../oxc/napi/playground'],
    },
  },
  plugins: [Vue(), UnoCSS()],
})
