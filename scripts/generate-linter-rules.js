#!/usr/bin/env node

import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT_JSON = path.join(process.cwd(), "src", "generated", "linter-rules.json");

function runViteLint() {
  return new Promise((resolve, reject) => {
    const cp = execFile(
      "pnpm",
      ["vite", "lint", "--rules", "--format=json"],
      {
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer to handle large JSON output
      },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));

        // Try to parse the output as JSON. The linter may print warnings or logs
        // before and after the JSON payload. Look for array/object that starts
        // on its own line followed by newline (not like [INFO] which has text after).
        try {
          return resolve(JSON.parse(stdout));
        } catch (e) {
          // Look for [ or { at start of line, followed by whitespace/newline
          // This avoids matching things like "[INFO]" which have text after the bracket
          const arrayMatch = stdout.match(/\n\s*\[\s*$/m) || stdout.match(/\n\s*\[\s*\n/);
          const objectMatch = stdout.match(/\n\s*\{\s*$/m) || stdout.match(/\n\s*\{\s*\n/);

          let firstOpen = Number.POSITIVE_INFINITY;
          if (arrayMatch && arrayMatch.index !== undefined) {
            firstOpen = Math.min(firstOpen, arrayMatch.index + arrayMatch[0].lastIndexOf("["));
          }
          if (objectMatch && objectMatch.index !== undefined) {
            firstOpen = Math.min(firstOpen, objectMatch.index + objectMatch[0].lastIndexOf("{"));
          }

          const lastClose = Math.max(stdout.lastIndexOf("]"), stdout.lastIndexOf("}"));

          if (
            firstOpen === Number.POSITIVE_INFINITY ||
            lastClose === -1 ||
            firstOpen >= lastClose
          ) {
            return reject(
              new Error("failed to parse JSON output from `pnpm vite lint --rules --format=json`"),
            );
          }

          const maybe = stdout.slice(firstOpen, lastClose + 1);

          try {
            return resolve(JSON.parse(maybe));
          } catch (e2) {
            return reject(
              new Error("failed to parse JSON output from `pnpm vite lint --rules --format=json`"),
            );
          }
        }
      },
    );
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
