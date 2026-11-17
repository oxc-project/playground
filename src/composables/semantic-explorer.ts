import { createGlobalState } from "@vueuse/core";
import { computed, ref, watch, watchEffect } from "vue";
import { useOxc } from "~/composables/oxc";
import {
  activeTab,
  editorValue,
  outputBindingHighlights,
  outputHoverRange,
} from "~/composables/state";
import { createSemanticSource, indexScoping, parseScoping } from "~/utils/scoping";

export const useSemanticExplorer = createGlobalState(async () => {
  const { oxc, semanticSource } = await useOxc();
  const json = computed(() => (oxc.value as { scopingJson?: string }).scopingJson ?? "");
  const parsed = computed(() => {
    try {
      return { data: parseScoping(json.value), error: undefined };
    } catch (error) {
      return { data: undefined, error: String(error) };
    }
  });
  const data = computed(() => parsed.value.data);
  const index = computed(() => data.value && indexScoping(data.value));
  const fresh = computed(
    () => semanticSource.value !== undefined && semanticSource.value === editorValue.value,
  );
  const source = computed(() => createSemanticSource(semanticSource.value ?? ""));
  const selectedSymbolId = ref<number>();
  const selectedScopeId = ref<number>();
  const search = ref("");

  // IDs belong to a single semantic snapshot. Never carry a selection into a
  // different source or let recycled IDs silently select an unrelated binding.
  watch(
    [json, semanticSource],
    () => {
      outputHoverRange.value = undefined;
      selectedSymbolId.value = undefined;
      selectedScopeId.value = data.value?.scopes.find((scope) => scope.parentId === null)?.id;
    },
    { immediate: true },
  );

  function selectSymbol(id: number) {
    selectedSymbolId.value = id;
    selectedScopeId.value = index.value?.symbols.get(id)?.scopeId;
  }
  function selectScope(id: number) {
    selectedScopeId.value = id;
    selectedSymbolId.value = undefined;
  }

  const symbol = computed(() =>
    selectedSymbolId.value === undefined
      ? undefined
      : index.value?.symbols.get(selectedSymbolId.value),
  );
  watchEffect(() => {
    outputBindingHighlights.value = undefined;
    if (activeTab.value !== "scoping" || !fresh.value || !symbol.value || !index.value) return;

    const binding = symbol.value;
    const spans = [
      binding.span,
      ...binding.redeclarations.map((declaration) => declaration.span),
      ...binding.references.flatMap((id) => {
        const reference = index.value!.references.get(id);
        return reference?.symbolId === binding.id ? [reference.span] : [];
      }),
    ];
    const uniqueSpans = new Map(spans.map((span) => [`${span.start}:${span.end}`, span]));
    const ranges = [...uniqueSpans.values()].flatMap((span) => {
      const location = source.value.locate(span);
      return location ? [location.range] : [];
    });
    outputBindingHighlights.value = { source: semanticSource.value!, ranges };
  });

  const scope = computed(() =>
    selectedScopeId.value === undefined
      ? undefined
      : index.value?.scopes.get(selectedScopeId.value),
  );
  const filteredSymbols = computed(() => {
    const query = search.value.trim().toLocaleLowerCase();
    return (data.value?.symbols ?? []).filter((symbol) => {
      const owner = index.value?.scopes.get(symbol.scopeId);
      return (
        !query ||
        `${symbol.name} ${symbol.id} ${symbol.flags} ${owner?.kind}`
          .toLocaleLowerCase()
          .includes(query)
      );
    });
  });
  return {
    json,
    data,
    index,
    fresh,
    source,
    symbol,
    scope,
    selectedSymbolId,
    selectedScopeId,
    search,
    filteredSymbols,
    selectSymbol,
    selectScope,
    parseError: computed(() => parsed.value.error),
  };
});
