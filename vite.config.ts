import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import Vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

let oxcCommit: string | undefined

const COMMIT_FILE = '../oxc/napi/playground/git-commit'
if (existsSync(COMMIT_FILE)) {
  oxcCommit = readFileSync('../oxc/napi/playground/git-commit', 'utf8').trim()
}

if (!oxcCommit) {
  try {
    const { stdout } = spawnSync('git', ['rev-parse', 'HEAD'], {
      cwd: '../oxc/napi/playground',
      encoding: 'utf8',
    })
    oxcCommit = stdout?.trim()
  } catch (e) {
    // Fallback for development
    oxcCommit = 'dev-commit'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.OXC_COMMIT': JSON.stringify(oxcCommit),
  },
  build: {
    target: 'esnext',
  },
  server: {
    // These two cross origin headers are used to fix the following error:
    // TypeError: Failed to execute 'decode' on 'TextDecoder': The provided ArrayBufferView value must not be shared.
    // The same headers are added to netlify via `dist/_headers`
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    fs: {
      allow: [__dirname, '../oxc/napi/playground'],
    },
  },
  plugins: [Vue(), UnoCSS()],
})
