<script setup lang="ts">
import { computed } from "vue";
import type {
  SemanticScope,
  SemanticSymbol,
  createSemanticSource,
  indexScoping,
} from "~/utils/scoping";
import { referenceUsage } from "~/utils/scoping";
import SemanticSource from "./SemanticSource.vue";

const props = defineProps<{
  symbol?: SemanticSymbol;
  scope?: SemanticScope;
  index: ReturnType<typeof indexScoping>;
  source: ReturnType<typeof createSemanticSource>;
  fresh: boolean;
}>();
defineEmits<{ selectSymbol: [id: number]; selectScope: [id: number] }>();
const references = computed(
  () =>
    props.symbol?.references.flatMap((id) => {
      const reference = props.index.references.get(id);
      return reference ? [reference] : [];
    }) ?? [],
);
const declarations = computed(() =>
  props.symbol
    ? props.symbol.redeclarations.length
      ? props.symbol.redeclarations
      : [{ span: props.symbol.span, nodeId: props.symbol.nodeId, flags: props.symbol.flags }]
    : [],
);
const sameName = computed(() => props.symbol && props.index.sameNameAncestor(props.symbol));
const catchVar = computed(() =>
  props.symbol?.catchVarBindingId == null
    ? undefined
    : props.index.symbols.get(props.symbol.catchVarBindingId),
);
const outerBindings = computed(() => {
  if (!props.scope) return [];
  const groups = new Map<
    number,
    { symbol: SemanticSymbol; count: number; crossesFunction: boolean }
  >();
  for (const reference of props.index.scopeReferences.get(props.scope.id) ?? []) {
    if (reference.symbolId === null) continue;
    const symbol = props.index.symbols.get(reference.symbolId);
    if (!symbol || symbol.scopeId === props.scope.id) continue;
    const group = groups.get(symbol.id) ?? { symbol, count: 0, crossesFunction: false };
    group.count++;
    group.crossesFunction ||= reference.isValue && props.index.crossesFunction(reference, symbol);
    groups.set(symbol.id, group);
  }
  return [...groups.values()];
});
const unresolved = computed(() =>
  props.scope
    ? (props.index.scopeReferences.get(props.scope.id) ?? []).filter(
        (reference) => reference.symbolId === null,
      )
    : [],
);
const capturedCount = computed(() =>
  props.symbol
    ? references.value.filter(
        (reference) => reference.isValue && props.index.crossesFunction(reference, props.symbol!),
      ).length
    : 0,
);
</script>

<template>
  <section class="semantic-inspector" aria-label="Binding inspector">
    <slot />
    <template v-if="symbol">
      <div class="semantic-inspector-title">
        <h3 class="truncate font-mono font-semibold" :title="symbol.name">{{ symbol.name }}</h3>
        <span class="semantic-meta">Binding #{{ symbol.id }}</span>
      </div>
      <p class="semantic-flags">{{ symbol.flags || "No flags" }}</p>
      <div class="semantic-section">
        <h4>Declaration{{ declarations.length === 1 ? "" : "s" }}</h4>
        <div v-for="(declaration, i) in declarations" :key="i" class="mb-1">
          <SemanticSource
            :location="source.locate(declaration.span)"
            :fresh
            snippet
            :label="`${symbol.name} declaration`"
          />
          <span v-if="declarations.length > 1" class="semantic-meta">{{ declaration.flags }}</span>
        </div>
      </div>
      <div class="semantic-section">
        <h4>Containing scope</h4>
        <button
          type="button"
          class="semantic-text-button"
          @click="$emit('selectScope', symbol.scopeId)"
        >
          {{ index.scopes.get(symbol.scopeId)?.kind }} #{{ symbol.scopeId }}
        </button>
        <p v-if="sameName" class="mt-1 text-muted-foreground">
          Same-name outer binding:
          <button
            type="button"
            class="semantic-text-button font-mono"
            @click="$emit('selectSymbol', sameName.id)"
          >
            {{ sameName.name }} #{{ sameName.id }}</button
          >. Type and value spaces may differ.
        </p>
        <p v-if="catchVar" class="mt-1 text-muted-foreground">
          Catch / var relation:
          <button
            type="button"
            class="semantic-text-button font-mono"
            @click="$emit('selectSymbol', catchVar.id)"
          >
            {{ catchVar.name }} #{{ catchVar.id }}
          </button>
          in the enclosing var scope.
        </p>
      </div>
      <div class="semantic-section">
        <h4>
          References <span class="semantic-meta">{{ references.length }}</span>
        </h4>
        <p class="mb-2 text-muted-foreground">
          {{ references.filter((r) => r.isRead).length }} reads ·
          {{ references.filter((r) => r.isWrite).length }} writes ·
          {{ references.filter((r) => r.isType).length }} type uses
        </p>
        <p v-if="capturedCount" class="mb-2 text-muted-foreground">
          {{ capturedCount }} value {{ capturedCount === 1 ? "use crosses" : "uses cross" }} a
          function boundary{{
            index.scopes.get(symbol.scopeId)?.parentId === null ? " from program scope" : ""
          }}.
        </p>
        <ol v-if="references.length" class="semantic-reference-list">
          <li v-for="reference in references" :key="reference.id" class="semantic-reference">
            <div class="flex flex-wrap items-center gap-x-2">
              <span class="font-medium">{{ referenceUsage(reference) }}</span
              ><button
                type="button"
                class="semantic-text-button semantic-meta"
                @click="$emit('selectScope', reference.scopeId)"
              >
                scope #{{ reference.scopeId }}</button
              ><span
                v-if="reference.isValue && index.crossesFunction(reference, symbol)"
                class="semantic-tag"
                >across function</span
              >
            </div>
            <SemanticSource
              :location="source.locate(reference.span)"
              :fresh
              snippet
              :label="`${symbol.name} ${referenceUsage(reference)}`"
            />
            <details class="semantic-raw-details">
              <summary>Reference #{{ reference.id }}</summary>
              <div>
                node #{{ reference.nodeId }} · bytes {{ reference.span.start }}–{{
                  reference.span.end
                }}
              </div>
              <div>{{ reference.flags }} · bits {{ reference.flagsBits }}</div>
            </details>
          </li>
        </ol>
        <p v-else class="semantic-empty">
          No resolved references. Declaration initialization is not a write reference.
        </p>
      </div>
      <details class="semantic-raw-details semantic-section">
        <summary>Binding metadata</summary>
        <div>
          symbol #{{ symbol.id }} · declaration node #{{ symbol.nodeId }} · scope #{{
            symbol.scopeId
          }}
        </div>
        <div>
          bytes {{ symbol.span.start }}–{{ symbol.span.end }} · flag bits {{ symbol.flagsBits }}
        </div>
        <div v-for="(declaration, i) in declarations" :key="i">
          declaration node #{{ declaration.nodeId }} · bytes {{ declaration.span.start }}–{{
            declaration.span.end
          }}
          · {{ declaration.flags }}
        </div>
      </details>
    </template>
    <template v-else-if="scope">
      <div class="semantic-inspector-title">
        <h3 class="font-semibold">{{ scope.kind }}</h3>
        <span class="semantic-meta">Scope #{{ scope.id }}</span>
      </div>
      <SemanticSource
        :location="source.locate(scope.span)"
        :fresh
        snippet
        :label="`${scope.kind} scope`"
      />
      <div class="semantic-section">
        <h4>Lexical parent</h4>
        <button
          v-if="scope.parentId !== null"
          type="button"
          class="semantic-text-button"
          @click="$emit('selectScope', scope.parentId)"
        >
          {{ index.scopes.get(scope.parentId)?.kind }} #{{ scope.parentId }}
        </button>
        <p v-else class="semantic-empty">Program scope</p>
      </div>
      <div class="semantic-section">
        <h4>
          Declared bindings
          <span class="semantic-meta">{{ index.declared.get(scope.id)?.length ?? 0 }}</span>
        </h4>
        <button
          v-for="binding in index.declared.get(scope.id)"
          :key="binding.id"
          type="button"
          class="semantic-binding-row"
          @click="$emit('selectSymbol', binding.id)"
        >
          <span class="font-mono">{{ binding.name }}</span
          ><span class="semantic-meta">#{{ binding.id }}</span>
        </button>
        <p v-if="!index.declared.get(scope.id)?.length" class="semantic-empty">
          No declared bindings
        </p>
      </div>
      <div class="semantic-section">
        <h4>Outer bindings used here</h4>
        <p class="semantic-empty mb-2">
          Direct occurrences in this scope. “Across function” marks value uses that cross a lexical
          function boundary.
        </p>
        <button
          v-for="group in outerBindings"
          :key="group.symbol.id"
          type="button"
          class="semantic-binding-row flex-wrap"
          @click="$emit('selectSymbol', group.symbol.id)"
        >
          <span class="font-mono">{{ group.symbol.name }}</span
          ><span class="semantic-meta">#{{ group.symbol.id }} · {{ group.count }} refs</span
          ><span v-if="group.crossesFunction" class="semantic-tag">across function</span>
        </button>
        <p v-if="!outerBindings.length" class="semantic-empty">None</p>
      </div>
      <div class="semantic-section">
        <h4>
          Unresolved references <span class="semantic-meta">{{ unresolved.length }}</span>
        </h4>
        <p class="semantic-empty mb-2">
          No explicit binding recorded. These can include globals and implicit arguments.
        </p>
        <div v-for="reference in unresolved" :key="reference.id" class="semantic-reference">
          <div class="font-mono">
            {{ reference.name }}
            <span class="semantic-meta font-sans"
              >{{ referenceUsage(reference) }} · #{{ reference.id }}</span
            >
          </div>
          <SemanticSource
            :location="source.locate(reference.span)"
            :fresh
            snippet
            :label="`${reference.name} unresolved reference`"
          />
          <details class="semantic-raw-details">
            <summary>Reference metadata</summary>
            <div>
              node #{{ reference.nodeId }} · scope #{{ reference.scopeId }} · bytes
              {{ reference.span.start }}–{{ reference.span.end }}
            </div>
            <div>{{ reference.flags }} · bits {{ reference.flagsBits }}</div>
          </details>
        </div>
        <p v-if="!unresolved.length" class="semantic-empty">None</p>
      </div>
      <details class="semantic-raw-details semantic-section">
        <summary>Scope metadata</summary>
        <div>{{ scope.flags }}</div>
        <div>
          scope #{{ scope.id }} · node #{{ scope.nodeId }} · flag bits {{ scope.flagsBits }}
        </div>
        <div>owner bytes {{ scope.span.start }}–{{ scope.span.end }}</div>
        <div>Lookup binding IDs: {{ scope.bindings.join(", ") || "none" }}</div>
      </details>
    </template>
    <p v-else class="semantic-empty">Select a scope or binding to inspect it.</p>
    <p class="semantic-footnote">
      Original-source static analysis. Reads and writes follow Oxc reference flags; property
      mutation is not binding reassignment. Function boundaries describe lexical use, not runtime
      allocation. Dynamic eval / with and TypeScript scopes have additional rules.
    </p>
  </section>
</template>
