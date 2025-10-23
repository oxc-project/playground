<script setup lang="ts">
import { computed, ref } from 'vue'
import MonacoEditor from '~/components/MonacoEditor.vue'
import { useOxc } from '~/composables/oxc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/ui/tabs'
import OutputPreview from './OutputPreview.vue'

const { oxc, options } = await useOxc()
const activeFormatterTab = ref('output')
const configError = ref<string>('')

const formatterConfig = computed({
  get: () => {
    try {
      const config = options.value.formatter || {}
      // Filter out undefined values for cleaner JSON
      const cleanConfig = Object.fromEntries(
        Object.entries(config).filter(([, v]) => v !== undefined),
      )
      return JSON.stringify(cleanConfig, null, 2)
    } catch {
      return '{}'
    }
  },
  set: (value: string) => {
    try {
      configError.value = ''
      const parsed = JSON.parse(value)
      options.value.formatter = {
        ...options.value.formatter,
        ...parsed,
      }
    } catch (error) {
      configError.value =
        error instanceof Error ? error.message : 'Invalid JSON'
    }
  },
})
</script>

<template>
  <div class="h-full flex flex-col">
    <Tabs
      v-model="activeFormatterTab"
      class="h-full w-full flex flex-1 flex-col overflow-hidden pb-40px"
    >
      <TabsList
        class="mx-3 mt-3 w-fit border border-[#e2e2e3]/50 rounded-lg from-blue-50/50 to-purple-50/50 bg-gradient-to-r p-1 dark:border-[#2e2e32]/50 dark:from-blue-950/20 dark:to-purple-950/20"
      >
        <TabsTrigger value="output"> Output </TabsTrigger>
        <TabsTrigger value="ir"> IR </TabsTrigger>
      </TabsList>

      <TabsContent force-mount value="output">
        <OutputPreview :code="oxc.formatterFormattedText" lang="tsx" />
      </TabsContent>

      <TabsContent force-mount value="ir">
        <OutputPreview :code="oxc.formatterIrText" lang="typescript" />
      </TabsContent>
    </Tabs>

    <details
      class="mx-3 mb-3 overflow-hidden border border-[#e2e2e3] rounded-xl shadow-sm transition-all dark:border-[#2e2e32] hover:shadow-md"
    >
      <summary
        class="cursor-pointer select-none from-blue-50/30 to-purple-50/30 bg-gradient-to-r p-3 text-sm font-medium transition-all dark:from-blue-950/10 hover:from-blue-50/50 dark:to-purple-950/10 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20"
      >
        <span class="inline-flex items-center gap-2">
          <span class="i-ri:settings-line" />
          Configure Options (Click to expand)
        </span>
      </summary>
      <div
        class="h-400px flex-1 overflow-hidden border-t border-[#e2e2e3] dark:border-[#2e2e32]"
      >
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
        <div
          v-if="configError"
          class="bg-red-50 p-2 text-sm text-red-500 dark:bg-red-950/20"
        >
          ⚠️ {{ configError }}
        </div>
      </div>
    </details>
  </div>
</template>
