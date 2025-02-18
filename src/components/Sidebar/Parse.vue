<script setup lang="ts">
import { computed } from 'vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import Select from '~/components/ui/Select.vue'
import { useOxc } from '~/composables/oxc'

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
  <div flex flex-col gap2 pt4>
    <div font-medium>Parser</div>

    <Select
      v-model="options.parser.sourceType"
      default-value="module"
      :options="[
        { value: 'module', label: 'Module' },
        { value: 'script', label: 'Script' },
      ]"
    />

    <Select
      v-model="language"
      :options="[
        { value: 'typescript', label: 'TypeScript' },
        { value: 'javascript', label: 'JavaScript' },
      ]"
    />

    <Checkbox
      :label="language === 'javascript' ? 'JSX' : 'TSX'"
      :model-value="jsx"
      @update:model-value="toggleJsx"
    />

    <Checkbox
      v-if="language === 'typescript'"
      :model-value="dts"
      label="D.TS"
      @update:model-value="toggleDts"
    />

    <Checkbox v-model="options.run.syntax" label="Check Syntax Errors" />

    <Checkbox
      v-model="options.parser.allowReturnOutsideFunction"
      label="allowReturnOutsideFunction"
      font-mono
      label-class="text-xs"
    />

    <Checkbox
      v-model="options.parser.preserveParens"
      default-checked
      label="preserveParens"
      font-mono
    />
  </div>
</template>
