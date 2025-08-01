<script setup lang="ts">
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import CopyContainer from './CopyContainer.vue'
import InputEditor from './input/InputEditor.vue'
import DiagnosticPanel from './output/DiagnosticPanel.vue'
import Output from './output/OutputPanel.vue'

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
    <div class="min-w-0 flex flex-1 flex-col pt-2">
      <div class="min-h-50vh flex-grow-2 flex-basis-none">
        <InputEditor
          :language="monacoLanguage"
          :filename="`/${options.parser.sourceFilename || 'test.tsx'}`"
          main
        />
      </div>

      <div
        v-if="oxc.getDiagnostics().length"
        class="min-h-0 flex flex-1 flex-col gap-2 overflow-auto border-t px-3 py-2 text-sm font-mono opacity-80"
      >
        <DiagnosticPanel />
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
