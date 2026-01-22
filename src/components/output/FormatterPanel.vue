<script setup lang="ts">
import { computed, ref } from "vue";
import MonacoEditor from "~/components/MonacoEditor.vue";
import { useOxc } from "~/composables/oxc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/tabs";
import OutputPreview from "./OutputPreview.vue";

const { oxc, options } = await useOxc();
const activeFormatterTab = ref("output");
const configError = ref<string>("");
// whether the details element is open
const detailsOpen = ref(true);

function onDetailsToggle(e: Event) {
  const t = e.target as HTMLDetailsElement | null;
  detailsOpen.value = !!t?.open;
}

const formatterConfig = computed({
  get: () => {
    try {
      const config = options.value.formatter || {};
      // Filter out undefined values for cleaner JSON
      const cleanConfig = Object.fromEntries(
        Object.entries(config).filter(([, v]) => v !== undefined),
      );
      return JSON.stringify(cleanConfig, null, 2);
    } catch {
      return "{}";
    }
  },
  set: (value: string) => {
    try {
      configError.value = "";
      const parsed = JSON.parse(value);
      options.value.formatter = {
        ...options.value.formatter,
        ...parsed,
      };
    } catch (error) {
      configError.value = error instanceof Error ? error.message : "Invalid JSON";
    }
  },
});
</script>

<template>
  <div class="h-full flex flex-col">
    <Tabs v-model="activeFormatterTab" class="h-full w-full flex flex-1 flex-col overflow-hidden">
      <TabsList class="mx-2 mt-2 w-fit">
        <TabsTrigger value="output">
          Output
        </TabsTrigger>
        <TabsTrigger value="ir">
          IR
        </TabsTrigger>
      </TabsList>

      <TabsContent force-mount value="output">
        <OutputPreview :code="oxc.formatterFormattedText" lang="tsx" />
      </TabsContent>

      <TabsContent force-mount value="ir">
        <OutputPreview :code="oxc.formatterIrText" lang="typescript" />
      </TabsContent>
    </Tabs>

    <details open class="mt-3 border bg-transparent" @toggle="onDetailsToggle($event)">
      <summary
        :aria-expanded="detailsOpen"
        class="flex cursor-pointer select-none items-center justify-between gap-3 bg-slate-100 px-4 py-2 text-sm font-medium dark:bg-slate-900"
      >
        <div>
          Configure Options
          <span class="ml-2 text-xs text-slate-500">
            {{ detailsOpen ? "(Click to collapse)" : "(Click to expand)" }}
          </span>
        </div>
        <svg
          class="chev h-4 w-4 text-slate-600 transition-transform duration-150 dark:text-slate-300"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6 8L10 12L14 8"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </summary>
      <div class="h-300px flex-1 overflow-hidden border-t rounded-b-md bg-white dark:bg-slate-950">
        <MonacoEditor
          v-model="formatterConfig"
          language="json"
          filename="formatter.json"
          :options="{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }"
        />
        <div v-if="configError" class="px-4 py-2 text-sm text-red-500">
          ⚠️ {{ configError }}
        </div>
      </div>
    </details>
  </div>
</template>

<style scoped>
details summary {
  list-style: none;
}

.chev {
  transform: rotate(-90deg);
}

details[open] .chev {
  transform: rotate(0deg);
}
</style>
