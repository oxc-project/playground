<script setup lang="ts">
import { ref } from 'vue'
import Checkbox from '~/components/ui/Checkbox.vue'
import { useOxc } from '~/composables/oxc'
import { Input } from '~/ui/input'

const { options } = await useOxc()
const showOptions = ref(false)

function handleShowOptions() {
  showOptions.value = !showOptions.value
}
</script>

<template>
  <div flex flex-col gap-3>
    <div
      class="text-base text-[#3c3c43] font-semibold dark:text-[#fffff5]/[.86]"
    >
      Parser
    </div>

    <label class="flex items-center gap-2 text-sm">
      <span class="text-[#3c3c43]/[.78] font-medium dark:text-[#fffff5]/[.70]"
        >Extension</span
      >
      <Input
        v-model="options.parser.extension"
        class="h-8 border-[#e2e2e3] rounded-lg p-2 text-xs transition-colors dark:border-[#2e2e32] focus:border-[#3451b2] dark:focus:border-[#a8b1ff]"
      />
    </label>

    <div text-sm>
      <button
        class="group flex items-center gap-1 text-[#3451b2] font-medium transition-all dark:text-[#a8b1ff] hover:underline"
        @click="handleShowOptions"
      >
        <span>Options</span>
        <div
          :class="
            showOptions ? 'i-ri:arrow-up-s-line' : 'i-ri:arrow-down-s-line'
          "
          class="transition-transform"
        />
      </button>
    </div>

    <div
      v-if="showOptions"
      class="flex flex-col gap-3 border border-[#e2e2e3]/50 rounded-lg bg-[#f6f6f7]/50 p-3 dark:border-[#2e2e32]/50 dark:bg-[#161618]/50"
    >
      <Checkbox
        v-model="options.parser.semanticErrors"
        label="semanticErrors"
        font-mono
        label-class="text-xs"
      />
      <Checkbox
        v-model="options.parser.preserveParens"
        default-checked
        label="preserveParens"
        font-mono
        label-class="text-xs"
      />
      <Checkbox
        v-model="options.parser.allowReturnOutsideFunction"
        label="allowReturnOutsideFunction"
        font-mono
        label-class="text-xs"
      />
      <Checkbox
        v-model="options.parser.allowV8Intrinsics"
        label="allowV8Intrinsics"
        font-mono
        label-class="text-xs"
      />
    </div>
  </div>
</template>
