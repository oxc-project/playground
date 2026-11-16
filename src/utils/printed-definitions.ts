import * as monaco from "monaco-editor/editor/editor.api";
import TsWorker from "monaco-editor/language/typescript/ts.worker?worker";
import { JsxEmit, ScriptTarget } from "monaco-editor/language/typescript/monaco.contribution";
import type { TypeScriptWorker } from "monaco-editor/languages/features/typescript/register";

// Each Printed model gets its own TS project. A custom language ID also keeps
// built-in source providers from syncing generated declarations into their worker.
export function registerPrintedDefinitions(model: monaco.editor.ITextModel): monaco.IDisposable {
  let worker: monaco.editor.MonacoWebWorker<TypeScriptWorker> | undefined;
  let disposed = false;
  const uri = model.uri.toString();
  const provider = monaco.languages.registerDefinitionProvider(
    { language: "printed-typescript", scheme: model.uri.scheme, pattern: model.uri.path },
    {
      async provideDefinition(current, position, token) {
        if (disposed || current !== model || model.isDisposed()) return [];
        const version = model.getVersionId();
        const offset = model.getOffsetAt(position);
        try {
          if (!worker) {
            const nativeWorker = new TsWorker();
            // Monaco 0.57's worker bootstrap: first install the initializer,
            // then pass createData before the public RPC wrapper takes over.
            nativeWorker.postMessage("ignore");
            nativeWorker.postMessage({
              compilerOptions: {
                allowJs: true,
                allowNonTsExtensions: true,
                target: ScriptTarget.ESNext,
                jsx: JsxEmit.Preserve,
              },
              extraLibs: {},
              inlayHintsOptions: {},
            });
            worker = monaco.editor.createWebWorker<TypeScriptWorker>({
              worker: nativeWorker,
              keepIdleModels: true,
            });
          }
          const service = await worker.withSyncedResources([model.uri]);
          if (disposed || model.isDisposed() || token.isCancellationRequested) return [];
          const definitions = await service.getDefinitionAtPosition(uri, offset);
          if (
            disposed ||
            model.isDisposed() ||
            token.isCancellationRequested ||
            model.getVersionId() !== version
          ) {
            return [];
          }
          // This milestone resolves only declarations in the generated file.
          return (definitions ?? [])
            .filter((definition) => definition.fileName === uri)
            .map((definition) => ({
              uri: model.uri,
              range: monaco.Range.fromPositions(
                model.getPositionAt(definition.textSpan.start),
                model.getPositionAt(definition.textSpan.start + definition.textSpan.length),
              ),
            }));
        } catch (error) {
          if (!disposed && !token.isCancellationRequested) {
            console.warn("Printed definition lookup failed:", error);
          }
          return [];
        }
      },
    },
  );
  return {
    dispose() {
      disposed = true;
      provider.dispose();
      worker?.dispose();
    },
  };
}
