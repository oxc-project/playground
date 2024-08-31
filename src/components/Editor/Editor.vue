<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { computed } from 'vue'
import Code from './Code.vue'
import CopyContainer from './CopyContainer.vue'
import Output from './OutputPanel.vue'

const { oxc, error, monacoLanguage, options } = await useOxc()

const errorStr = computed(() => {
  return Array.isArray(error.value)
    ? error.value.map(stringifyError).join('\n')
    : stringifyError(error)
})

function stringifyError(error: unknown) {
  if (!error) return ''
  if (error instanceof Error) return error.stack
  return String(error)
}
</script>

<template>
  <main class="min-h-0 flex flex-1 flex-col md:flex-row">
    <div class="min-w-0 flex-1 py-2">
      <div class="h-2/3 w-full">
        <Code
          :language="monacoLanguage"
          :filename="`/${options.parser.sourceFilename || 'test.tsx'}`"
        />
      </div>
      <div class="h-1/3 w-full px-4">
        <div v-for="d in oxc.getDiagnostics()" :key="d.message">
          {{ d.severity }}: {{ d.message }}
        </div>
      </div>
    </div>

    <div class="h-px w-full bg-[#e2e2e3] md:h-full md:w-px dark:bg-[#2e2e32]" />
    <div class="min-w-0 flex-1">
      <Output v-if="!error" />
      <CopyContainer v-else :value="errorStr || ''" class="min-w-0 w-full flex">
        <pre
          class="h-full overflow-auto p-2 text-sm text-red-400"
          v-text="errorStr"
        />
      </CopyContainer>
    </div>
  </main>
</template>
