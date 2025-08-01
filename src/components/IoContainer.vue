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
  <main class="min-h-0 flex flex-1 flex-col md:flex-row bg-white dark:bg-gray-900">
    <div class="min-w-0 flex flex-1 flex-col">
      <div class="min-h-50vh flex-grow-2 flex-basis-none p-4">
        <div class="h-full rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
          <InputEditor
            :language="monacoLanguage"
            :filename="`/${options.parser.sourceFilename || 'test.tsx'}`"
            main
          />
        </div>
      </div>

      <div
        v-if="oxc.getDiagnostics().length"
        class="min-h-0 flex flex-1 flex-col gap-2 overflow-auto border-t border-gray-200 dark:border-gray-700 p-4"
      >
        <div class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
          <DiagnosticPanel />
        </div>
      </div>
    </div>

    <div class="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent md:h-full md:w-px md:bg-gradient-to-b dark:via-gray-600" />
    
    <div class="min-w-0 flex-1 p-4">
      <div class="h-full rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
        <Output v-if="!error" />
        <CopyContainer v-else :value="errorStr || ''" class="min-w-0 w-full h-full flex">
          <div class="flex-1 p-6 bg-red-50 dark:bg-red-900/20">
            <div class="flex items-center gap-2 mb-4">
              <div class="i-ri:error-warning-line text-red-500 text-lg" />
              <h3 class="text-red-700 dark:text-red-300 font-semibold">Error</h3>
            </div>
            <pre
              class="overflow-auto text-sm text-red-600 dark:text-red-400 font-mono bg-white dark:bg-gray-900 p-4 rounded-lg border border-red-200 dark:border-red-800"
              v-text="errorStr"
            />
          </div>
        </CopyContainer>
      </div>
    </div>
  </main>
</template>
