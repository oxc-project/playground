#!/usr/bin/env node

import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

const OUT_JSON = path.join(process.cwd(), "src", "generated", "linter-rules.json");

function runViteLint() {
  return new Promise((resolve, reject) => {
    // Use a temp file to avoid stdout buffering limits
    const tmpFile = path.join(tmpdir(), `vite-lint-${Date.now()}.json`);

    exec(`pnpm vite lint --rules --format=json > "${tmpFile}" 2>&1`, (err, stdout, stderr) => {
      let data;
      try {
        data = fs.readFileSync(tmpFile, "utf8");
        fs.unlinkSync(tmpFile); // Clean up temp file
      } catch (readErr) {
        return reject(new Error(`Failed to read temp file: ${readErr.message}`));
      }

      if (err && !data) {
        return reject(new Error(stderr || err.message));
      }

      // Try to parse the output as JSON. The linter may print warnings or logs
      // before and after the JSON payload. Look for array/object that starts
      // on its own line (not like [INFO] which has text immediately after the bracket).
      try {
        return resolve(JSON.parse(data));
      } catch (e) {
        // Look for [ or { at start of line (after newline), with only whitespace before/after
        // the bracket on that line. This avoids matching things like "[INFO] message"
        // Match: newline + optional spaces + bracket + (newline OR whitespace+newline OR end of string)
        const arrayMatch = data.match(/\n[ \t]*\[(?:\s*\n|\s*$)/);
        const objectMatch = data.match(/\n[ \t]*\{(?:\s*\n|\s*$)/);

        let firstOpen = Number.POSITIVE_INFINITY;
        if (arrayMatch && arrayMatch.index !== undefined) {
          firstOpen = Math.min(firstOpen, arrayMatch.index + arrayMatch[0].indexOf("["));
        }
        if (objectMatch && objectMatch.index !== undefined) {
          firstOpen = Math.min(firstOpen, objectMatch.index + objectMatch[0].indexOf("{"));
        }

        const lastClose = Math.max(data.lastIndexOf("]"), data.lastIndexOf("}"));

        if (firstOpen === Number.POSITIVE_INFINITY || lastClose === -1 || firstOpen >= lastClose) {
          return reject(
            new Error("failed to parse JSON output from `pnpm vite lint --rules --format=json`"),
          );
        }

        const maybe = data.slice(firstOpen, lastClose + 1);

        try {
          return resolve(JSON.parse(maybe));
        } catch (e2) {
          return reject(
            new Error("failed to parse JSON output from `pnpm vite lint --rules --format=json`"),
          );
        }
      }
    });
  });
}

async function main() {
  const checkOnly = process.argv.includes("--check");
  const data = await runViteLint();
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
