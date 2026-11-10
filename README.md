# Oxc Playground

[playground.oxc.rs](https://playground.oxc.rs)

## Development

Assuming the oxc repository is in `../oxc`:

- in a different terminal and in the `oxc` repository:
  - `just install-wasm`
  - `just watch-playground`
- in this repo: `pnpm run dev`

## Running output

In the Printed tab, click **Run output** to execute the generated JavaScript in a
fresh sandboxed iframe. Console messages and runtime errors appear below the code.
**Stop** removes the iframe, including its timers; editing the output also stops
the previous run. The status stays **Running** while the code's timers are still
pending, and shows **Finished** once the synchronous run and all timers are done.
Promise-based work that is still pending is not tracked. Blocking synchronous code
can freeze the tab; Stop cannot interrupt it.

The executed copy of the output also carries an inline source map, so stack traces
in devtools point back at the original source. The printed output is unchanged.

Scripts keep their script semantics, and ES modules execute as modules. In
Transformer, **Runtime helpers** selects the npm package path (the default) or
versioned esm.sh URLs in the generated output. The esm.sh version matches the
runtime in the sibling Oxc checkout, and the choice is saved in the share URL.

To run code that needs runtime helpers, set **Extension** to **mjs** (or **mts**) and
**Runtime helpers → esm.sh**. The browser loads the imports exactly as printed.
**Run output** is disabled with a tip when the output uses `require()` or bare npm
helper imports. Other package imports, relative imports, CommonJS files, and
Node.js APIs are not supported. TypeScript and JSX need the Transformer enabled
before running.

## Tests

Run the dependency-analysis regressions with `pnpm test`.

Browser regressions use an installed Google Chrome and mock esm.sh responses.
Start the dev server first:

```bash
pnpm dev --port 5199
```

Then run:

```bash
pnpm test:browser
```

Set `PLAYGROUND_URL` to test a server at a different origin.

# [Sponsored By](https://oxc.rs/sponsor)

<p align="center">
  <a href="https://oxc.rs/sponsor">
    <img src="https://raw.githubusercontent.com/oxc-project/sponsors/main/sponsors.svg" alt="Our sponsors" />
  </a>
</p>
