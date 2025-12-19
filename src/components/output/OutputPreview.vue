<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import CopyContainer from "~/components/CopyContainer.vue";
import {
  highlight,
  shikiLoaded,
  shikiLoading,
  type ShikiLang,
} from "~/utils/shiki";

const props = defineProps<{
  code?: string;
  lang: ShikiLang;
}>();

const highlightedCode = ref("");
const isHighlighting = ref(false);

// Watch for changes and trigger highlighting
watchEffect(async () => {
  if (!props.code) {
    highlightedCode.value = "";
    return;
  }

  isHighlighting.value = true;

  try {
    const result = await highlight(props.code, props.lang);
    highlightedCode.value = result;
  } catch (error) {
    console.warn("Failed to highlight code:", error);
    // Fallback to plain text
    highlightedCode.value = `<pre class="!bg-transparent p-2"><code>${escapeHtml(props.code)}</code></pre>`;
  } finally {
    isHighlighting.value = false;
  }
});

const showLoading = computed(
  () => isHighlighting.value || (shikiLoading.value && !shikiLoaded.value),
);

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
</script>

<template>
  <CopyContainer :value="code || ''" class="min-w-0 w-full flex">
    <div class="flex-1 overflow-auto text-sm leading-relaxed">
      <!-- Loading skeleton -->
      <div v-if="showLoading && !highlightedCode" class="animate-pulse">
        <div class="mb-2 h-4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mb-2 h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
      </div>

      <!-- Highlighted content -->
      <div v-else :class="{ 'opacity-75': showLoading }" v-html="highlightedCode" />
    </div>
  </CopyContainer>
</template>
