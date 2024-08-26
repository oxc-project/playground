<script setup lang="ts">
import { useOxc } from "src/composables/useOxc";
import { computed } from "vue";
import OutputPreview from "./OutputPreview.vue";

const { oxc } = await useOxc();
const symbols = computed(() => {
  const { symbols: symbolTable } = oxc.value;
  if (!symbolTable) return [];

  return symbolTable.declarations.map((astNodeId, symbolId) => {
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
  });
});
const code = computed(() => JSON.stringify(symbols.value, undefined, 2));
</script>

<template>
  <OutputPreview :code lang="json" />
</template>
