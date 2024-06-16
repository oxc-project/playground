import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: [__dirname, "../oxc1/npm/oxc-wasm"],
    },
  },
});
