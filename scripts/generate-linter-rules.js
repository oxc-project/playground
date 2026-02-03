#!/usr/bin/env node

import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT_JSON = path.join(process.cwd(), "src", "generated", "linter-rules.json");

function runViteLint() {
  return new Promise((resolve, reject) => {
    const cp = execFile(
      "vite",
      ["lint", "--rules", "--format=json"],
      { encoding: "utf8" },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(stderr || err.message));

        // Try to parse the output as JSON. The linter may print non-JSON logs
        // after the JSON payload; attempt to salvage by truncating to the last
        // closing bracket.
        try {
          return resolve(JSON.parse(stdout));
        } catch (e) {
          const lastClose = Math.max(stdout.lastIndexOf("]"), stdout.lastIndexOf("}"));
          if (lastClose === -1) {
            return reject(
              new Error("failed to parse JSON output from `vite lint --rules --format=json`"),
            );
          }

          const maybe = stdout.slice(0, lastClose + 1);
          try {
            return resolve(JSON.parse(maybe));
          } catch (e2) {
            return reject(
              new Error("failed to parse JSON output from `vite lint --rules --format=json`"),
            );
          }
        }
      },
    );

    cp.stdout && cp.stdout.pipe(process.stdout);
    cp.stderr && cp.stderr.pipe(process.stderr);
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
