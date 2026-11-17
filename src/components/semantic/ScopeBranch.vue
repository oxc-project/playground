<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import type { SemanticScope, createSemanticSource, indexScoping } from "~/utils/scoping";
import SemanticSource from "./SemanticSource.vue";

const props = defineProps<{
  scope: SemanticScope;
  index: ReturnType<typeof indexScoping>;
  source: ReturnType<typeof createSemanticSource>;
  fresh: boolean;
  selectedSymbolId?: number;
  selectedScopeId?: number;
}>();
defineEmits<{ selectSymbol: [id: number]; selectScope: [id: number] }>();
const expanded = ref(true);
const children = computed(() => props.index.children.get(props.scope.id) ?? []);
const bindings = computed(() => props.index.declared.get(props.scope.id) ?? []);
</script>

<template>
  <li class="semantic-branch">
    <div
      class="semantic-scope-row"
      :class="{
        'semantic-selected': selectedSymbolId === undefined && selectedScopeId === scope.id,
      }"
    >
      <button
        type="button"
        class="semantic-disclosure"
        :aria-expanded="expanded"
        :aria-label="`${expanded ? 'Collapse' : 'Expand'} ${scope.kind} scope ${scope.id}`"
        @click="expanded = !expanded"
      >
        <Icon
          icon="ri:arrow-right-s-line"
          class="size-4"
          :class="{ 'rotate-90': expanded }"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        class="semantic-scope-name"
        :title="scope.kind"
        :aria-label="`Inspect ${scope.kind} scope ${scope.id}`"
        :aria-pressed="selectedSymbolId === undefined && selectedScopeId === scope.id"
        @click="$emit('selectScope', scope.id)"
      >
        <span class="truncate">{{ scope.kind }}</span
        ><span class="semantic-meta">#{{ scope.id }}</span>
      </button>
      <SemanticSource :location="source.locate(scope.span)" :fresh :label="`${scope.kind} scope`" />
    </div>
    <div v-if="expanded" class="semantic-branch-content">
      <ul
        v-if="bindings.length"
        class="semantic-bindings"
        :aria-label="`Bindings in ${scope.kind} scope ${scope.id}`"
      >
        <li v-for="symbol in bindings" :key="symbol.id">
          <button
            type="button"
            class="semantic-binding-row"
            :class="{ 'semantic-selected': selectedSymbolId === symbol.id }"
            :aria-pressed="selectedSymbolId === symbol.id"
            :aria-label="`Inspect binding ${symbol.name} #${symbol.id}`"
            :title="symbol.name"
            @click="$emit('selectSymbol', symbol.id)"
          >
            <span class="truncate font-mono">{{ symbol.name }}</span>
            <span class="semantic-meta"
              >#{{ symbol.id }} · {{ symbol.references.length }} refs</span
            >
            <span
              v-if="index.sameNameAncestor(symbol)"
              class="semantic-tag"
              title="A binding with this name also exists in an ancestor scope"
              >same name ↑</span
            >
          </button>
        </li>
      </ul>
      <p v-else class="semantic-empty py-1">No declared bindings</p>
      <ul v-if="children.length" aria-label="Nested scopes">
        <ScopeBranch
          v-for="child in children"
          :key="child.id"
          :scope="child"
          :index
          :source
          :fresh
          :selected-symbol-id
          :selected-scope-id
          @select-symbol="$emit('selectSymbol', $event)"
          @select-scope="$emit('selectScope', $event)"
        />
      </ul>
    </div>
  </li>
</template>
