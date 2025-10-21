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
      <TabsList class="mx-2 mt-2 w-fit">
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

    <details>
      <summary cursor-pointer select-none>
        Configure Options (Click to expand)
      </summary>
      <div class="h-400px flex-1 overflow-hidden border rounded-md">
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
        <div v-if="configError" text-sm text-red-500>⚠️ {{ configError }}</div>
      </div>
    </details>
  </div>
</template>
