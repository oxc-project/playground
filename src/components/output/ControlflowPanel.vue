<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { ref, useTemplateRef } from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { renderSVG, vizError, vizLoading } from "~/utils/viz";
import OutputPreview from "./OutputPreview.vue";

const { oxc, options } = await useOxc();
const panelEl = useTemplateRef<HTMLDivElement>("panel");
const isRendering = ref(false);

watchDebounced(
  [() => oxc.value.controlFlowGraph, panelEl],
  async ([graph, panel]) => {
    if (!panel || !graph) return;

    isRendering.value = true;

    try {
      const svg = await renderSVG(graph);
      if (svg && panel) {
        panel.replaceChildren(svg);
      } else if (panel) {
        // Show error message if rendering failed
        panel.innerHTML = `
          <div class="p-4 text-center text-gray-500 dark:text-gray-400">
            <p>Failed to render graph visualization.</p>
            <p class="text-sm mt-2">Please use the "Raw" view to see the graph data.</p>
          </div>
        `;
      }
    } catch (error) {
      console.warn("Failed to render control flow graph:", error);
      if (panel) {
        panel.innerHTML = `
          <div class="p-4 text-center text-red-500">
            <p>Error rendering graph: ${error instanceof Error ? error.message : "Unknown error"}</p>
            <p class="text-sm mt-2">Please use the "Raw" view to see the graph data.</p>
          </div>
        `;
      }
    } finally {
      isRendering.value = false;
    }
  },
  { immediate: true, debounce: 100 },
);

const raw = ref(false);
</script>

<template>
  <div class="w-full flex flex-col">
    <div flex gap4 p2>
      <Checkbox v-model="raw" label="Raw" />
      <Checkbox v-model="options.controlFlow.verbose" label="Verbose" />
    </div>

    <div class="overflow-auto">
      <OutputPreview v-show="raw" :code="oxc.controlFlowGraph" lang="text" />

      <div v-show="!raw" class="relative">
        <!-- Loading states for graph visualization -->
        <div
          v-if="(vizLoading || isRendering) && !vizError"
          class="p-8 text-center"
        >
          <div class="animate-pulse space-y-4">
            <div
              class="mx-auto h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"
            />
            <div
              class="mx-auto h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700"
            />
            <div class="mx-auto h-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {{
              vizLoading
                ? "Loading graph visualization..."
                : "Rendering graph..."
            }}
          </p>
        </div>

        <!-- Error state -->
        <div v-else-if="vizError" class="p-8 text-center text-red-500">
          <p>Failed to load graph visualization library</p>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{ vizError }}
          </p>
          <p class="mt-2 text-sm">
            Please use the "Raw" view to see the graph data.
          </p>
        </div>

        <!-- Graph container -->
        <div
          ref="panel"
          :class="{ 'opacity-50': isRendering }"
          class="transition-opacity duration-200"
        />
      </div>
    </div>
  </div>
</template>
