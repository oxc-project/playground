# Oxc Playground

[playground.oxc.rs](https://playground.oxc.rs)

## Development

Assuming the oxc repository is in `../oxc`:

- in a different terminal and in the `oxc` repository:
  - `just install-wasm`
  - `just watch-playground`
- in this repo: `pnpm run dev`

## Running output

**Run output** in the Printed tab executes the generated JavaScript in a sandboxed
iframe and shows its console output. **Stop** removes the iframe and its timers;
editing the output stops the run. The status stays **Running** until synchronous
code and every scheduled timer finish. Pending promises are not tracked, and a
blocking loop cannot be interrupted.

The executed copy carries an inline source map, so devtools map back to the
original source; the printed output is unchanged. Scripts run as scripts and ES
modules as modules.

**Runtime helpers** in Transformer selects npm package paths (the default) or
versioned esm.sh URLs matching the sibling Oxc checkout, and the choice is saved
in the share URL. To run helper-using output, set **Extension** to **mjs** (or
**mts**) and **Runtime helpers → esm.sh**. The sandbox uses the browser's native
module loader; bare npm imports, `require()`, and Node.js APIs are unavailable.
Execution errors appear in the console. Enable the Transformer first to run
TypeScript or JSX.

**Compare** runs the same input through an esnext baseline with TypeScript/JSX
lowering enabled and minification, define/inject replacements, and optional
transforms disabled. **Run output** then executes the baseline and current output
in separate sandboxes with their own console and status. Stop, Clear console, and
collapse/expand apply to both. Compare mode is saved in the share URL.

# [Sponsored By](https://oxc.rs/sponsor)

<p align="center">
  <a href="https://oxc.rs/sponsor">
    <img src="https://raw.githubusercontent.com/oxc-project/sponsors/main/sponsors.svg" alt="Our sponsors" />
  </a>
</p>
