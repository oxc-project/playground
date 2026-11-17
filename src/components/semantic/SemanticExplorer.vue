<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef } from "vue";
import OutputPreview from "~/components/output/OutputPreview.vue";
import { useOxc } from "~/composables/oxc";
import { useSemanticExplorer } from "~/composables/semantic-explorer";
import BindingInspector from "./BindingInspector.vue";
import ScopeBranch from "./ScopeBranch.vue";
import SemanticSource from "./SemanticSource.vue";
import "./semantic.css";

const props = defineProps<{ view: "scope" | "symbol" }>();
const { oxc, error } = await useOxc();
const {
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
  selectSymbol: setSelectedSymbol,
  selectScope: setSelectedScope,
  parseError,
} = await useSemanticExplorer();
const layout = useTemplateRef<HTMLDivElement>("layout");
async function revealInspector() {
  await nextTick();
  if (layout.value && layout.value.clientWidth < 620) {
    layout.value
      .querySelector<HTMLElement>(".semantic-inspector")
      ?.scrollIntoView({ block: "start" });
  }
}
function selectSymbol(id: number) {
  setSelectedSymbol(id);
  void revealInspector();
}
function selectScope(id: number) {
  setSelectedScope(id);
  void revealInspector();
}
const raw = ref(false);
const rawFormat = ref<string>(props.view);
const searchId = useId();
const code = computed(() => {
  if (rawFormat.value === "scope") return oxc.value.scopeText;
  if (rawFormat.value === "symbol") return oxc.value.symbolsJson;
  try {
    return json.value ? JSON.stringify(JSON.parse(json.value), null, 2) : "";
  } catch {
    return json.value;
  }
});
</script>

<template>
  <div class="semantic-explorer h-full min-w-0 overflow-auto">
    <div class="semantic-toolbar">
      <p class="min-w-0 flex-1 text-muted-foreground">
        {{ data?.scopes.length ?? 0 }} scopes · {{ data?.symbols.length ?? 0 }} bindings ·
        {{ data?.references.length ?? 0 }} references
      </p>
      <label class="flex items-center gap-1.5"
        ><input v-model="raw" type="checkbox" class="accent-primary" /> Raw</label
      >
      <select
        v-if="raw"
        v-model="rawFormat"
        aria-label="Raw output format"
        class="semantic-input max-w-40"
      >
        <option value="scope">Scope text</option>
        <option value="symbol">Symbol JSON</option>
        <option value="scoping">Scoping JSON</option>
      </select>
    </div>
    <OutputPreview v-if="raw" :code :lang="rawFormat === 'scope' ? 'tsx' : 'json'" />
    <p v-else-if="error" role="status" class="p-3 text-sm text-muted-foreground">
      Semantic analysis did not complete. Edit the source or options to try again.
    </p>
    <p v-else-if="parseError" role="status" class="p-3 text-sm">{{ parseError }}</p>
    <p v-else-if="!data || !index" role="status" class="p-3 text-sm text-muted-foreground">
      Structured scoping data is unavailable. Enable scope or symbol analysis and use an Oxc binding
      with scopingJson. Existing output is available in Raw.
    </p>
    <template v-else>
      <p v-if="!fresh" role="status" class="border-b p-2 text-xs text-muted-foreground">
        These results belong to an earlier source revision. Source navigation is paused.
      </p>
      <div ref="layout" class="semantic-layout">
        <section
          class="semantic-browser"
          :aria-label="view === 'scope' ? 'Scope tree' : 'Symbol index'"
        >
          <template v-if="view === 'scope'">
            <h3 class="semantic-browser-title">Lexical scopes</h3>
            <ul class="semantic-tree" aria-label="Lexical scopes">
              <ScopeBranch
                v-for="root in index.children.get(null)"
                :key="root.id"
                :scope="root"
                :index
                :source
                :fresh
                :selected-symbol-id
                :selected-scope-id
                @select-symbol="selectSymbol"
                @select-scope="selectScope"
              />
            </ul>
          </template>
          <template v-else>
            <div class="semantic-search">
              <label :for="searchId" class="mb-1 block font-medium">Find a binding</label
              ><input
                :id="searchId"
                v-model="search"
                type="search"
                placeholder="Name, flags, scope or ID…"
                class="semantic-input w-full"
              />
              <p class="semantic-meta mt-1" role="status">
                {{ filteredSymbols.length }} of {{ data.symbols.length }} bindings
              </p>
            </div>
            <ul aria-label="Bindings">
              <li
                v-for="binding in filteredSymbols"
                :key="binding.id"
                class="semantic-index-item"
                :class="{ 'semantic-selected': selectedSymbolId === binding.id }"
              >
                <button
                  type="button"
                  class="semantic-index-button"
                  :aria-pressed="selectedSymbolId === binding.id"
                  :aria-label="`Inspect binding ${binding.name} #${binding.id}`"
                  @click="selectSymbol(binding.id)"
                >
                  <span class="font-mono truncate">{{ binding.name }}</span
                  ><span class="semantic-meta"
                    >#{{ binding.id }} · {{ binding.references.length }} refs</span
                  ><span class="semantic-index-context"
                    >{{ index.scopes.get(binding.scopeId)?.kind }} #{{ binding.scopeId }} ·
                    {{ binding.flags }}</span
                  >
                </button>
                <SemanticSource
                  :location="source.locate(binding.span)"
                  :fresh
                  :label="`${binding.name} declaration`"
                />
              </li>
            </ul>
            <p v-if="!filteredSymbols.length" class="semantic-empty p-3">
              {{ search.trim() ? "No matching bindings." : "No declared bindings." }}
            </p>
          </template>
        </section>
        <BindingInspector
          :symbol
          :scope
          :index
          :source
          :fresh
          @select-symbol="selectSymbol"
          @select-scope="selectScope"
        >
          <button
            type="button"
            class="semantic-back semantic-text-button mb-2"
            @click="layout?.querySelector('.semantic-browser')?.scrollIntoView({ block: 'start' })"
          >
            ↑ Back to {{ view === "scope" ? "scopes" : "bindings" }}
          </button>
        </BindingInspector>
      </div>
    </template>
  </div>
</template>
