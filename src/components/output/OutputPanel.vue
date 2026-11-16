<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { usePreferredReducedMotion, useResizeObserver, useScroll } from "@vueuse/core";
import { nextTick, onMounted, ref, useId, useTemplateRef, watch } from "vue";
import { Button } from "~/ui/button";
import { useOxc } from "~/composables/oxc";
import { activeTab } from "~/composables/state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs";

import CodegenPanel from "./CodegenPanel.vue";
import ControlflowPanel from "./ControlflowPanel.vue";
import EsTreePanel from "./EsTreePanel.vue";
import FormatterPanel from "./FormatterPanel.vue";
import RustAstPanel from "./RustAstPanel.vue";
import ScopePanel from "./ScopePanel.vue";
import SymbolPanel from "./SymbolPanel.vue";

const { options } = await useOxc();
const navigation = useTemplateRef("navigation");
const tabViewport = useTemplateRef("tabViewport");
const tabViewportId = useId();
const overflowing = ref(false);
const reducedMotion = usePreferredReducedMotion();
const { arrivedState, measure } = useScroll(tabViewport);

function revealTab(tab: HTMLElement | null) {
  const viewport = tabViewport.value;
  if (!viewport || !tab) return;
  const bounds = viewport.getBoundingClientRect();
  const tabBounds = tab.getBoundingClientRect();
  if (tabBounds.left < bounds.left) viewport.scrollLeft += tabBounds.left - bounds.left;
  else if (tabBounds.right > bounds.right) viewport.scrollLeft += tabBounds.right - bounds.right;
  measure();
}

function revealActiveTab() {
  revealTab(
    tabViewport.value?.querySelector<HTMLElement>('[role="tab"][data-state="active"]') ?? null,
  );
}

function revealFocusedTab(event: FocusEvent) {
  if (event.target instanceof HTMLElement && event.target.matches('[role="tab"]')) {
    revealTab(event.target);
  }
}

function scrollTabs(direction: number) {
  const viewport = tabViewport.value;
  if (!viewport) return;
  viewport.scrollBy({
    left: direction * viewport.clientWidth * 0.75,
    behavior: reducedMotion.value === "reduce" ? "instant" : "smooth",
  });
}

useResizeObserver(navigation, async () => {
  const list = tabViewport.value?.querySelector<HTMLElement>('[role="tablist"]');
  overflowing.value = !!list && list.scrollWidth > navigation.value!.clientWidth;
  await nextTick();
  revealActiveTab();
});
watch(activeTab, revealActiveTab, { flush: "post" });

function updateRunOptions() {
  options.value.run.formatter = activeTab.value === "formatter";
  options.value.run.cfg = activeTab.value === "cfg";
}

watch([activeTab], updateRunOptions);

onMounted(updateRunOptions);
</script>

<template>
  <Tabs
    v-model="activeTab"
    default-value="ast"
    class="h-full flex flex-1 flex-col flex-nowrap"
    activation-mode="manual"
  >
    <div ref="navigation" class="output-navigation flex h-[45px] shrink-0 border-b border-border">
      <Button
        v-if="overflowing"
        variant="ghost"
        size="icon"
        class="output-tab-scroll h-full w-8 shrink-0 rounded-none border-r"
        aria-label="Scroll output tabs left"
        :aria-controls="tabViewportId"
        :disabled="arrivedState.left"
        @click="scrollTabs(-1)"
      >
        <Icon icon="ri:arrow-left-s-line" />
      </Button>
      <div
        :id="tabViewportId"
        ref="tabViewport"
        class="output-tab-viewport min-w-0 flex-1 overflow-x-auto"
        @focusin="revealFocusedTab"
      >
        <TabsList
          aria-label="Output formats"
          class="output-tabs flex h-full w-max min-w-full items-stretch gap-0 rounded-none border-0 p-0"
        >
          <TabsTrigger value="codegen"> Printed </TabsTrigger>
          <TabsTrigger value="ast"> ESTree AST </TabsTrigger>
          <TabsTrigger value="ir"> Rust AST </TabsTrigger>
          <TabsTrigger value="formatter"> Formatter </TabsTrigger>
          <TabsTrigger value="scope"> Scope </TabsTrigger>
          <TabsTrigger value="symbol"> Symbol </TabsTrigger>
          <TabsTrigger value="cfg"> Controlflow Graph </TabsTrigger>
        </TabsList>
      </div>
      <Button
        v-if="overflowing"
        variant="ghost"
        size="icon"
        class="output-tab-scroll h-full w-8 shrink-0 rounded-none border-l"
        aria-label="Scroll output tabs right"
        :aria-controls="tabViewportId"
        :disabled="arrivedState.right"
        @click="scrollTabs(1)"
      >
        <Icon icon="ri:arrow-right-s-line" />
      </Button>
    </div>

    <div class="h-full min-h-0 min-w-0">
      <TabsContent value="ast">
        <EsTreePanel />
      </TabsContent>
      <!-- Keep runner iframes mounted so switching tabs does not stop execution. -->
      <TabsContent value="codegen" force-mount>
        <CodegenPanel />
      </TabsContent>
      <TabsContent value="ir">
        <RustAstPanel />
      </TabsContent>
      <TabsContent value="formatter">
        <FormatterPanel />
      </TabsContent>
      <TabsContent value="scope">
        <ScopePanel />
      </TabsContent>
      <TabsContent value="symbol">
        <SymbolPanel />
      </TabsContent>
      <TabsContent value="cfg">
        <ControlflowPanel />
      </TabsContent>
    </div>
  </Tabs>
</template>
