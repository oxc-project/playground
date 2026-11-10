import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: "*.spec.ts",
  timeout: 90000,
  use: {
    baseURL: process.env.PLAYGROUND_URL ?? "http://localhost:5199",
    channel: "chrome",
  },
});
