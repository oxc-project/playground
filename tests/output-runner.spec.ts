import { expect, test, type Page } from "@playwright/test";

async function openOutput(
  page: Page,
  code: string,
  extension = "js",
  transform = false,
  helpers: "npm" | "esm" = "npm",
) {
  const query = new URLSearchParams({
    code,
    helpers,
    options: JSON.stringify({ parser: { extension }, run: { transform, lint: false } }),
  });
  await page.goto(`/?${query}`);
  await expect(page.getByRole("button", { name: "Run output", exact: true })).toBeVisible({
    timeout: 60000,
  });
}

const source = 'class A { #a; } new A(); console.log("constructed");';

for (const helpers of ["npm", "esm"] as const) {
  test(`script with ${helpers} helpers: disables Run for require calls`, async ({ page }) => {
    await openOutput(page, source, "js", true, helpers);
    const printed = page.locator('[role="tabpanel"] pre').first();
    await expect(printed).toContainText("require(");
    await expect(printed).toContainText("/helpers/classPrivateFieldInitSpec");
    if (helpers === "esm") await expect(printed).toContainText("https://esm.sh/");
    await expect(page.getByRole("button", { name: "Run output", exact: true })).toBeDisabled();
    await expect(
      page.getByText("Browsers do not provide require().", { exact: false }),
    ).toBeVisible();
    await expect(page.locator('iframe[title="Output execution sandbox"]')).toHaveCount(0);
  });
}

test("selecting esm.sh changes printed imports and survives a reload", async ({ page }) => {
  await openOutput(page, source, "mjs", true);
  const printed = page.locator('[role="tabpanel"] pre').first();
  const run = page.getByRole("button", { name: "Run output", exact: true });
  await expect(printed).toContainText("@oxc-project/runtime/helpers/classPrivateFieldInitSpec");
  await expect(run).toBeDisabled();
  await expect(
    page.getByText("Browsers need a URL for runtime imports.", { exact: false }),
  ).toBeVisible();
  const select = page
    .locator("section[aria-labelledby='transformer-heading']")
    .getByRole("combobox");
  await select.click();
  await page.getByRole("option", { name: "esm.sh (versioned URL)", exact: true }).click();
  await expect(printed).toContainText(
    /https:\/\/esm\.sh\/@oxc-project\/runtime@\d+\.\d+\.\d+\/helpers\/classPrivateFieldInitSpec/,
  );
  await expect(run).toBeEnabled();
  await expect(page).toHaveURL(/[?&]helpers=esm(?:&|$)/);
  await page.reload();
  await expect(printed).toContainText("https://esm.sh/");
  await expect(select).toHaveText("esm.sh (versioned URL)");
  await expect(run).toBeEnabled();
  await select.click();
  await page.getByRole("option", { name: "@oxc-project/runtime", exact: true }).click();
  await expect(printed).toContainText("@oxc-project/runtime/helpers/classPrivateFieldInitSpec");
  await expect(printed).not.toContainText("https://esm.sh/");
  await expect(run).toBeDisabled();
});

test("module: runs the printed esm.sh imports and their dependencies", async ({ page }) => {
  const requests: string[] = [];
  await page.route("https://esm.sh/**", async (route) => {
    const url = route.request().url();
    requests.push(url);
    const body = url.endsWith("/helpers/classPrivateFieldInitSpec")
      ? 'import check from "./checkPrivateRedeclaration.mjs"; export default function(o, m, v) { check(o, m); m.set(o, v); }'
      : 'export default function(o, m) { if (m.has(o)) throw new TypeError("Already initialized"); }';
    await route.fulfill({
      contentType: "application/javascript",
      headers: { "access-control-allow-origin": "*" },
      body,
    });
  });
  await openOutput(page, source, "mjs", true, "esm");
  const printed = page.locator('[role="tabpanel"] pre').first();
  await expect(printed).toContainText("https://esm.sh/@oxc-project/runtime@");
  const printedBefore = await printed.innerText();
  expect(printedBefore).toContain("import ");
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(page.getByRole("log", { name: "Execution console" })).toContainText("constructed");
  await expect(page.getByRole("status")).toHaveText("Finished");
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toHaveCount(0);
  expect(requests).toHaveLength(2);
  expect(requests[0]).toMatch(
    /@oxc-project\/runtime@\d+\.\d+\.\d+\/helpers\/classPrivateFieldInitSpec$/,
  );
  expect(printedBefore).toContain(requests[0]);
  expect(requests[1]).toContain("/helpers/checkPrivateRedeclaration.mjs");
  await expect(printed).toHaveText(printedBefore);
  const frame = page.locator('iframe[title="Output execution sandbox"]');
  await expect(frame).toHaveAttribute("sandbox", "allow-scripts");
  expect(await frame.getAttribute("srcdoc")).not.toContain('type="importmap"');
});

test("preserves script globals, isolates the parent, and starts fresh on rerun", async ({
  page,
}) => {
  await openOutput(
    page,
    `
    var count = (globalThis.count || 0) + 1;
    console.log(this === globalThis, globalThis.count);
    try { parent.document; } catch (error) { console.log(error.name); }
    console.log("</script><script>parent.hacked = true</script>");
  `,
  );
  const consolePanel = page.getByRole("log", { name: "Execution console" });
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(consolePanel).toContainText("true 1");
  await expect(consolePanel).toContainText("SecurityError");
  await expect(consolePanel).toContainText("</script><script>parent.hacked = true</script>");
  expect(await page.evaluate(() => "hacked" in window)).toBe(false);
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(consolePanel).toContainText("true 1");
  await expect(consolePanel).not.toContainText("true 2");
  await expect(page.getByRole("status")).toHaveText("Finished");
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Close console", exact: true }).click();
  await expect(page.locator('iframe[title="Output execution sandbox"]')).toHaveCount(0);
  await expect(consolePanel).toHaveCount(0);
});

for (const code of [
  'throw new Error("runtime failure")',
  'Promise.reject(new Error("async failure"))',
]) {
  test(`reports ${code.startsWith("throw") ? "thrown errors" : "unhandled rejections"}`, async ({
    page,
  }) => {
    await openOutput(page, code);
    await page.getByRole("button", { name: "Run output", exact: true }).click();
    await expect(page.getByRole("status")).toHaveText("Failed");
    await expect(page.getByRole("log", { name: "Execution console" })).toContainText(/failure/);
  });
}

test("keeps the running state while timers are pending", async ({ page }) => {
  await openOutput(
    page,
    `
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      console.log("tick", tick);
      if (tick === 2) clearInterval(id);
    }, 250);
  `,
  );
  const status = page.getByRole("status");
  const consolePanel = page.getByRole("log", { name: "Execution console" });
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(consolePanel).toContainText("tick 1");
  await expect(status).toHaveText("Running…");
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toBeVisible();
  await expect(status).toHaveText("Finished");
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toHaveCount(0);
});

test("Stop cancels pending timers", async ({ page }) => {
  await openOutput(page, 'let tick = 0; setInterval(() => console.log("tick", ++tick), 100);');
  const status = page.getByRole("status");
  const consolePanel = page.getByRole("log", { name: "Execution console" });
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(consolePanel).toContainText("tick 1");
  await expect(status).toHaveText("Running…");
  await page.getByRole("button", { name: "Stop", exact: true }).click();
  await expect(status).toHaveText("Stopped");
  const ticks = async () => ((await consolePanel.innerText()).match(/tick \d+/g) ?? []).length;
  const before = await ticks();
  await page.waitForTimeout(400);
  expect(await ticks()).toBe(before);
});

test("executes with an inline source map without changing the printed output", async ({ page }) => {
  await openOutput(page, 'const value = 1;\nconsole.log("mapped", value);', "js", true);
  const printed = page.locator('[role="tabpanel"] pre').first();
  const printedBefore = await printed.innerText();
  expect(printedBefore).not.toContain("sourceMappingURL");
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Finished");
  await expect(printed).toHaveText(printedBefore);
  const srcdoc = await page
    .locator('iframe[title="Output execution sandbox"]')
    .getAttribute("srcdoc");
  const payload = JSON.parse(
    /runner-payload" type="application\/json">([\s\S]*?)<\/script>/.exec(srcdoc!)?.[1] ?? "{}",
  );
  const footer =
    /\n\/\/# sourceURL=oxc-output\.js\n\/\/# sourceMappingURL=data:application\/json;charset=utf-8;base64,([A-Za-z0-9+/=]+)$/.exec(
      payload.code,
    );
  expect(footer).not.toBeNull();
  const map = JSON.parse(Buffer.from(footer![1], "base64").toString("utf8"));
  expect(map.mappings.length).toBeGreaterThan(0);
  expect(map.sources.length).toBeGreaterThan(0);
});

test("reports module execution failure when a helper request fails", async ({ page }) => {
  const requests: string[] = [];
  await page.route("https://esm.sh/**", (route) => {
    requests.push(route.request().url());
    return route.abort("failed");
  });
  await openOutput(page, source, "mjs", true, "esm");
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Failed");
  await expect(page.getByRole("log", { name: "Execution console" })).toContainText(
    "Module execution failed",
  );
  expect(requests[0]).toMatch(/https:\/\/esm\.sh\/@oxc-project\/runtime@\d+\.\d+\.\d+\/helpers\//);
});

test("disables Run and explains unsupported imports", async ({ page }) => {
  await openOutput(page, 'import React from "react"; console.log(React);', "mjs");
  await expect(page.getByRole("button", { name: "Run output", exact: true })).toBeDisabled();
  await expect(page.getByText('Unsupported import "react".', { exact: false })).toBeVisible();
  await expect(page.locator('iframe[title="Output execution sandbox"]')).toHaveCount(0);
});

test("allows locally defined require functions", async ({ page }) => {
  await openOutput(
    page,
    'function require(name) { return "local:" + name; } console.log(require("test"));',
  );
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(page.getByRole("log", { name: "Execution console" })).toContainText("local:test");
  await expect(page.getByRole("status")).toHaveText("Finished");
});

test("preserves the Window receiver and arguments for strict timeout callbacks", async ({
  page,
}) => {
  await openOutput(
    page,
    `
    setTimeout(function (message) {
      console.log(message, this === globalThis, this.document === document);
    }, 0, "timer receiver");
  `,
    "mjs",
  );
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  await expect(page.getByRole("log", { name: "Execution console" })).toContainText(
    "timer receiver true true",
  );
  await expect(page.getByRole("status")).toHaveText("Finished");
});

test("tracks string timers and accepts clearTimeout for an interval", async ({ page }) => {
  await openOutput(
    page,
    `
    let message = "string timeout";
    globalThis.stringInterval = setInterval('console.log("string tick")', 100);
    setTimeout('console.log(message)', 0);
  `,
  );
  await page.getByRole("button", { name: "Run output", exact: true }).click();
  const consolePanel = page.getByRole("log", { name: "Execution console" });
  await expect(consolePanel).toContainText("string timeout");
  await expect(consolePanel).toContainText("string tick");
  await expect(page.getByRole("status")).toHaveText("Running…");
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toBeVisible();
  const sandbox = page.frames().find((frame) => frame.parentFrame() === page.mainFrame());
  await sandbox!.evaluate("clearTimeout(globalThis.stringInterval)");
  await expect(page.getByRole("status")).toHaveText("Finished");
  await expect(page.getByRole("button", { name: "Stop", exact: true })).toHaveCount(0);
});
