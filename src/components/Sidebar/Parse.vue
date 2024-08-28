<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { computed } from 'vue'
import Checkbox from '../ui/Checkbox.vue'
import Select from '../ui/Select.vue'

const { options } = await useOxc()

function getFilename() {
  return options.value.parser.sourceFilename || 'test.tsx'
}

function setFilename(language: string, jsx: boolean, dts: boolean) {
  let ext: string
  if (dts) {
    ext = 'd.ts'
  } else {
    ext = `${language === 'typescript' ? 'ts' : 'js'}${jsx ? 'x' : ''}`
  }
  options.value.parser.sourceFilename = `test.${ext}`
}

const language = computed({
  get: () => (/\.[cm]?tsx?/.test(getFilename()) ? 'typescript' : 'javascript'),
  set: (value) => setFilename(value, jsx.value, dts.value),
})

const jsx = computed({
  get: () => /\.[jt]sx/.test(getFilename()),
  set: (value) => setFilename(language.value, value, dts.value),
})

const dts = computed({
  get: () => getFilename().endsWith('.d.ts'),
  set: (value) => setFilename(language.value, jsx.value, value),
})

function toggleJsx(checked: boolean) {
  if (checked && language.value === 'typescript') {
    dts.value = false
  }
  jsx.value = checked
}

function toggleDts(checked: boolean) {
  dts.value = checked
  if (checked) {
    jsx.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 pt-4">
    <div class="text-muted-foreground font-medium">Source Type</div>

    <Select
      v-model="options.parser.sourceType"
      title="Module Type"
      default-value="module"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />

    <Select
      v-model="language"
      title="Language"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
      ]"
    />

    <Checkbox
      id="jsx"
      :title="language === 'javascript' ? 'JSX' : 'TSX'"
      :model-value="jsx"
      @update:model-value="toggleJsx"
    />

    <Checkbox
      v-if="language === 'typescript'"
      id="dts"
      :model-value="dts"
      title="D.TS"
      @update:model-value="toggleDts"
    />

    <div class="text-muted-foreground font-medium">Parser</div>

    <Checkbox
      id="syntax"
      v-model="options.run.syntax"
      title="Check Syntax Errors"
    />

    <Checkbox
      id="allowReturnOutsideFunction"
      v-model="options.parser.allowReturnOutsideFunction"
      title="allowReturnOutsideFunction"
      font-mono
      label-class="text-xs"
    />

    <Checkbox
      id="preserveParens"
      v-model="options.parser.preserveParens"
      default-checked
      title="preserveParens"
      font-mono
    />
  </div>
</template>
