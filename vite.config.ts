import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";

let oxcCommit: string | undefined;

const COMMIT_FILE = "../oxc/napi/playground/git-commit";
if (existsSync(COMMIT_FILE)) {
  oxcCommit = readFileSync("../oxc/napi/playground/git-commit", "utf8").trim();
}

if (!oxcCommit) {
  const { stdout } = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: "../oxc/napi/playground",
    encoding: "utf8",
  });
  oxcCommit = stdout?.trim() || "unknown";
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "import.meta.env.OXC_COMMIT": JSON.stringify(oxcCommit),
  },
  build: {
    target: "esnext",
    // Monaco (3.7MB), Viz (1.4MB), Shiki (557KB) are large but unavoidable
    chunkSizeWarningLimit: 4000,
    rolldownOptions: {
      experimental: {
        strictExecutionOrder: true,
      },
      output: {
        // Disable live bindings for smaller bundle (externals don't change)
        externalLiveBindings: false,
        codeSplitting: {
          groups: [
            // Monaco Editor - all ESM modules (except workers which are handled separately)
            {
              name: "monaco-vendor",
              test: /monaco-editor\/esm/,
              priority: 10,
            },
            // Shiki syntax highlighter
            {
              name: "shiki-vendor",
              test: /node_modules\/@shikijs|node_modules\/shiki/,
              priority: 10,
            },
            // Vue ecosystem
            {
              name: "vue-vendor",
              test: /node_modules\/(vue|@vue|@vueuse)/,
              priority: 5,
            },
            // UI libraries
            {
              name: "ui-vendor",
              test: /node_modules\/(radix-vue|class-variance-authority|clsx|tailwind-merge)/,
              priority: 5,
            },
          ],
        },
      },
    },
  },
  experimental: {
    bundledDev: true,
    enableNativePlugin: true,
  },
  server: {
    // These two cross origin headers are used to fix the following error:
    // TypeError: Failed to execute 'decode' on 'TextDecoder': The provided ArrayBufferView value must not be shared.
    // The same headers are added to netlify via `dist/_headers`
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
    fs: {
      allow: [__dirname, "../oxc/napi/playground"],
    },
  },
  plugins: [Vue(), tailwindcss()],
});
