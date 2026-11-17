<script setup lang="ts">
import { computed, nextTick, ref, useId, useTemplateRef, watch } from "vue";
import OutputPreview from "~/components/output/OutputPreview.vue";
import { useOxc } from "~/composables/oxc";
import { useSemanticExplorer } from "~/composables/semantic-explorer";
import { scopingView as view } from "~/composables/state";
import BindingInspector from "./BindingInspector.vue";
import ScopeBranch from "./ScopeBranch.vue";
import SemanticSource from "./SemanticSource.vue";
import "./semantic.css";

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
const inspector = useTemplateRef<InstanceType<typeof BindingInspector>>("inspector");
const detailOpen = ref(false);
const raw = ref(false);
const rawFormat = ref("scoping");
const searchId = useId();

watch([json, source], () => {
  detailOpen.value = false;
});

async function revealInspector() {
  detailOpen.value = true;
  await nextTick();
  const element = inspector.value?.$el as HTMLElement | undefined;
  if (!element) return;
  element.scrollTop = 0;
  if (layout.value && layout.value.clientWidth < 560) element.focus({ preventScroll: true });
}
function selectSymbol(id: number) {
  setSelectedSymbol(id);
  void revealInspector();
}
function selectScope(id: number) {
  setSelectedScope(id);
  void revealInspector();
}
function changeView(value: "scopes" | "bindings") {
  view.value = value;
  if (value === "scopes") search.value = "";
  detailOpen.value = false;
}
async function backToBrowser() {
  detailOpen.value = false;
  await nextTick();
  const browser = layout.value?.querySelector<HTMLElement>(".semantic-browser");
  const target =
    browser?.querySelector<HTMLElement>('[aria-pressed="true"]') ??
    browser?.querySelector<HTMLElement>(".semantic-search input");
  target?.focus({ preventScroll: true });
}
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
  <div class="semantic-explorer h-full min-w-0">
    <div class="semantic-toolbar">
      <div class="semantic-view-switch" role="group" aria-label="Browse scoping">
        <button
          type="button"
          :aria-pressed="view === 'scopes'"
          :disabled="raw"
          @click="changeView('scopes')"
        >
          Scopes
        </button>
        <button
          type="button"
          :aria-pressed="view === 'bindings'"
          :disabled="raw"
          @click="changeView('bindings')"
        >
          Bindings
        </button>
      </div>
      <label class="semantic-raw-toggle"
        ><input v-model="raw" type="checkbox" class="accent-primary" /> Raw</label
      >
      <select
        v-if="raw"
        v-model="rawFormat"
        aria-label="Raw output format"
        class="semantic-input semantic-raw-format"
      >
        <option value="scoping">Scoping JSON</option>
        <option value="scope">Scope text</option>
        <option value="symbol">Symbol JSON</option>
      </select>
    </div>
    <div v-if="raw" class="semantic-raw-output">
      <OutputPreview :code :lang="rawFormat === 'scope' ? 'tsx' : 'json'" />
    </div>
    <p v-else-if="error" role="status" class="p-3 text-sm text-muted-foreground">
      Semantic analysis did not complete. Edit the source or options to try again.
    </p>
    <p v-else-if="parseError" role="status" class="p-3 text-sm">{{ parseError }}</p>
    <p v-else-if="!data || !index" role="status" class="p-3 text-sm text-muted-foreground">
      Scoping data is unavailable. Existing scope and symbol output is available in Raw.
    </p>
    <template v-else>
      <p v-if="!fresh" role="status" class="shrink-0 border-b p-2 text-xs text-muted-foreground">
        These results belong to an earlier source revision. Source navigation is paused.
      </p>
      <div ref="layout" class="semantic-layout" :class="{ 'semantic-detail-open': detailOpen }">
        <section
          class="semantic-browser"
          :aria-label="view === 'scopes' ? 'Scope tree' : 'Binding index'"
        >
          <div class="semantic-search">
            <label :for="searchId" class="sr-only">Find a binding</label>
            <input
              :id="searchId"
              v-model="search"
              type="search"
              placeholder="Find a binding…"
              class="semantic-input w-full"
              @focus="changeView('bindings')"
            />
            <p class="semantic-meta semantic-counts" role="status">
              <template v-if="view === 'scopes'"
                >{{ data.scopes.length }} scopes · {{ data.symbols.length }} bindings</template
              >
              <template v-else
                >{{ filteredSymbols.length }} of {{ data.symbols.length }} bindings</template
              >
              · {{ data.references.length }} references
            </p>
          </div>
          <ul v-if="view === 'scopes'" class="semantic-tree" aria-label="Lexical scopes">
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
          <template v-else>
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
                  :title="binding.name"
                  @click="selectSymbol(binding.id)"
                >
                  <span class="semantic-index-name">
                    <span class="font-mono truncate">{{ binding.name }}</span>
                    <span class="semantic-meta">#{{ binding.id }}</span>
                  </span>
                  <span class="semantic-index-context"
                    >{{ index.scopes.get(binding.scopeId)?.kind }} #{{ binding.scopeId }} ·
                    {{ binding.flags }}</span
                  >
                </button>
                <span class="semantic-index-references semantic-meta">
                  {{ binding.references.length }}
                  {{ binding.references.length === 1 ? "ref" : "refs" }}
                </span>
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
          ref="inspector"
          :symbol
          :scope
          :index
          :source
          :fresh
          @select-symbol="selectSymbol"
          @select-scope="selectScope"
        >
          <button type="button" class="semantic-back semantic-text-button" @click="backToBrowser">
            ← Back to {{ view === "scopes" ? "scopes" : "bindings" }}
          </button>
        </BindingInspector>
      </div>
    </template>
  </div>
</template>
