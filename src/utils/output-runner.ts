import bootstrap from "./runner-bootstrap.js?raw";
import { analyzeOutput } from "./runner-dependencies";

export function getRunDisabledReason(code: string, sourceType: string): string | undefined {
  if (sourceType !== "script" && sourceType !== "module") {
    return "Run output supports scripts and ES modules. CommonJS files and Node.js APIs are not supported.";
  }
  try {
    const { helpers, hasRequire } = analyzeOutput(code, sourceType);
    if (hasRequire) {
      return "Browsers do not provide require(). For generated helpers, select Extension .mjs and Runtime helpers esm.sh.";
    }
    if (helpers.some((specifier) => specifier.startsWith("@oxc-project/runtime/"))) {
      return "Browsers need a URL for runtime imports. Select Runtime helpers esm.sh in Transformer.";
    }
  } catch (error) {
    // Parser messages are about the input syntax, not about how to enable Run.
    if (error instanceof SyntaxError) {
      return "The output is not valid JavaScript. Fix the source error, or enable the Transformer for TypeScript and JSX input.";
    }
    return error instanceof Error ? error.message : String(error);
  }
}

function toDataUrl(sourceMap: string): string {
  const bytes = new TextEncoder().encode(sourceMap);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return `data:application/json;charset=utf-8;base64,${btoa(binary)}`;
}

export function createRunnerDocument(code: string, sourceType: string, sourceMap?: string): string {
  const disabledReason = getRunDisabledReason(code, sourceType);
  if (disabledReason) throw new Error(disabledReason);
  // Only the executed copy carries the source map; the printed output stays as
  // Oxc generated it. The mapping URL must be the last line of the script.
  const executable =
    code +
    "\n//# sourceURL=oxc-output.js" +
    (sourceMap ? `\n//# sourceMappingURL=${toDataUrl(sourceMap)}` : "");
  // Code is data until the sandbox executes it. In particular, a literal closing
  // script tag in the output must never terminate this JSON element.
  const payload = JSON.stringify({ code: executable, sourceType }).replaceAll("<", "\\u003c");
  return `<!doctype html>
<html><head><meta charset="utf-8"></head><body>
<script id="runner-payload" type="application/json">${payload}</script>
<script type="module">${bootstrap}</script>
</body></html>`;
}
