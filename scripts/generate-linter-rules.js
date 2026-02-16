#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const OUT_JSON = path.join(process.cwd(), "src", "generated", "linter-rules.json");
const RULES_URL =
  "https://raw.githubusercontent.com/oxc-project/website/main/.vitepress/data/rules.json";

async function fetchRules() {
  try {
    const response = await fetch(RULES_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch rules: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(`Failed to fetch rules from ${RULES_URL}: ${err.message}`);
  }
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const data = await fetchRules();
  const out = JSON.stringify(data, null, 2) + "\n";

  if (checkOnly) {
    let current = null;
    try {
      current = fs.readFileSync(OUT_JSON, "utf8");
    } catch (e) {
      console.error(
        `Missing ${OUT_JSON}: run \u001b[32;1mpnpm run generate:linter-rules\u001b[0m to create it`,
      );
      process.exit(2);
    }

    if (current !== out) {
      console.error(
        "linter rules JSON is out of date. Run `pnpm run generate:linter-rules` and commit the result.",
      );
      process.exit(1);
    }

    console.log("linter rules JSON is up-to-date");
    process.exit(0);
  }

  fs.writeFileSync(OUT_JSON, out, "utf8");
  console.log(`Wrote ${OUT_JSON}`);
}

main().catch((err) => {
  console.error(err && err.message ? err.message : String(err));
  process.exit(1);
});
