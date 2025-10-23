<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import { Splitter, SplitterPanel, SplitterResizeHandle } from '~/ui/splitter'
import CopyContainer from './CopyContainer.vue'
import InputEditor from './input/InputEditor.vue'
import DiagnosticPanel from './output/DiagnosticPanel.vue'
import Output from './output/OutputPanel.vue'

const { oxc, error, monacoLanguage, options } = await useOxc()

const isMdAndUp = useMediaQuery('(min-width: 768px)')
const splitterDirection = computed(() =>
  isMdAndUp.value ? 'horizontal' : 'vertical',
)

const errorStr = computed(() => {
  return Array.isArray(error.value)
    ? error.value.map(stringifyError).join('\n')
    : stringifyError(error.value)
})

function stringifyError(error: unknown) {
  if (!error) return ''
  if (error instanceof Error)
    return [error.message, error.stack].filter(Boolean).join('\n')
  return String(error)
}
</script>

<template>
  <main class="min-h-0 flex flex-1">
    <Splitter :direction="splitterDirection" class="flex-1">
      <SplitterPanel :default-size="50" :min-size="20" class="flex flex-col">
        <div class="min-w-0 flex flex-1 flex-col pt-2">
          <div
            class="min-h-50vh flex-grow-2 flex-basis-none overflow-hidden rounded-tl-xl shadow-inner"
          >
            <InputEditor
              :language="monacoLanguage"
              :filename="`/test.${options.parser.extension}`"
              main
            />
          </div>

          <div
            v-if="oxc.getDiagnostics().length"
            class="min-h-0 flex flex-1 flex-col gap2 overflow-auto border-t border-[#e2e2e3]/50 bg-amber-50/30 px-3 py-3 text-sm font-mono opacity-90 dark:border-[#2e2e32]/50 dark:bg-amber-950/10"
          >
            <DiagnosticPanel />
          </div>
        </div>
      </SplitterPanel>

      <SplitterResizeHandle
        class="relative w-1.5 bg-[#e2e2e3]/40 transition-colors md:h-1.5 dark:bg-[#2e2e32]/40 hover:bg-[#3451b2]/20 dark:hover:bg-[#a8b1ff]/20"
      />

      <SplitterPanel :default-size="50" :min-size="20" class="overflow-hidden">
        <div class="h-full min-w-0 overflow-hidden rounded-tr-xl shadow-inner">
          <Output v-if="!error" class="h-full overflow-auto" />
          <CopyContainer
            v-else
            :value="errorStr || ''"
            class="min-w-0 w-full flex"
          >
            <pre
              class="m-2 h-full overflow-auto border border-red-200/50 rounded-xl bg-red-50/50 p-4 text-sm text-red-500 dark:border-red-800/50 dark:bg-red-950/20 dark:text-red-400"
              v-text="errorStr"
            />
          </CopyContainer>
        </div>
      </SplitterPanel>
    </Splitter>
  </main>
</template>
