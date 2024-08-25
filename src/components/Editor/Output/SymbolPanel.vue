<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { onUnmounted, ref, watch } from "vue";
import type { Reference } from "@oxc/oxc_wasm";

type Symbol = {
  name: string;
  span: { start: number; end: number };
  astNodeId: number;
  scopeId: number;
  flags: any;
  references: Omit<Reference, "symbolId">[];
};
const symbols = ref<Symbol[]>([]);
const { oxc } = useOxc();

const watchSymbols = watch(oxc, () => {
  const { symbols: symbolTable } = oxc;
  if (!symbolTable) {
    symbols.value = [];
    return;
  }
  symbols.value = symbolTable.declarations.map(
    (astNodeId, symbolId): Symbol => {
      const name = symbolTable.names[symbolId];
      const span = symbolTable.spans[symbolId];
      const flags = symbolTable.flags[symbolId];
      const scopeId = symbolTable.scopeIds[symbolId];
      const referenceIds = symbolTable.resolvedReferences[symbolId];
      const references = referenceIds
        .map((id) => symbolTable.references[id])
        .map(({ symbolId, ...reference }) => reference);

      return {
        name,
        span,
        astNodeId,
        scopeId,
        flags,
        references,
      };
    },
  );
});
onUnmounted(watchSymbols);
</script>

<template>
  <div class="overflow-y-scroll h-full max-h-full">
    <pre>{{ symbols }}</pre>
  </div>
</template>
