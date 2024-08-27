import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      allow: [__dirname, '../oxc/npm/oxc-wasm'],
    },
  },
  plugins: [Vue(), UnoCSS(), Icons()],
})
