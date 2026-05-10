import { execSync, spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import Vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite-plus";

// Resolve the oxc sibling repo directory. In a normal checkout it's at ../oxc,
// but when running from a git worktree the relative path differs. Fall back to
// locating the main worktree via `git worktree list` and resolving from there.
function resolveOxcDir(): string {
  const sibling = path.resolve(import.meta.dirname, "../oxc");
  if (existsSync(sibling)) return sibling;

  try {
    const output = execSync("git worktree list --porcelain", {
      encoding: "utf8",
    });
    const mainWorktree = output.split("\n").find((l) => l.startsWith("worktree "));
    if (mainWorktree) {
      const mainRepo = mainWorktree.slice("worktree ".length);
      const resolved = path.resolve(mainRepo, "../oxc");
      if (existsSync(resolved)) return resolved;
    }
  } catch {
    // git not available — fall through
  }

  return sibling;
}

const oxcDir = resolveOxcDir();
const oxcPlayground = path.join(oxcDir, "napi/playground");

let oxcCommit: string | undefined;

const COMMIT_FILE = path.join(oxcPlayground, "git-commit");
if (existsSync(COMMIT_FILE)) {
  oxcCommit = readFileSync(COMMIT_FILE, "utf8")?.trim();
  if (!oxcCommit) {
    const { stdout } = spawnSync("git", ["rev-parse", "HEAD"], {
      cwd: oxcPlayground,
      encoding: "utf8",
    });
    oxcCommit = stdout.trim();
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  lint: {
    plugins: ["typescript", "unicorn", "oxc", "import", "jsdoc", "promise", "node"],
    jsPlugins: [
      "./eslint-local-rules.js",
      "eslint-plugin-unused-imports",
      {
        name: "@eslint-community/eslint-comments",
        specifier: "@eslint-community/eslint-plugin-eslint-comments",
      },
      "eslint-plugin-regexp",
      "eslint-plugin-de-morgan",
      "eslint-plugin-perfectionist",
      "eslint-plugin-command",
      {
        name: "vue-js",
        specifier: "eslint-plugin-vue",
      },
    ],
    rules: {
      "import/default": "off", // No default export found in imported module "monaco-editor/esm/vs/language/typescript/ts.worker?worker"
      "vue-js/no-ref-as-operand": "error",
      "vue-js/no-dupe-keys": "error",
      "vue-js/no-reserved-keys": "error",
    },
  },
  staged: {
    "*": "vp fmt --no-error-on-unmatched-pattern",
    "*.{js,jsx,tsx,ts,mts,vue}": "vp lint --fix",
  },
  fmt: {},
  resolve: {
    alias: {
      "~": path.resolve(import.meta.dirname, "./src"),
      "@oxc": oxcDir,
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
      output: {
        strictExecutionOrder: true,
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
      allow: [import.meta.dirname, oxcPlayground],
    },
  },
  plugins: [Vue(), tailwindcss()],
});
