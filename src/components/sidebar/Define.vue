<script setup lang="ts">
import { ref, watch } from 'vue'
import { useOxc } from '~/composables/oxc'
import { Input } from '~/ui/input'

const { options } = await useOxc()

const leftValue = ref('')
const rightValue = ref('')

watch([leftValue, rightValue], () => {
  const left = leftValue.value
  const right = rightValue.value
  if (left && right) {
    options.value.define.define[left] = right
  }
  if (!left || !right) {
    delete options.value.define.define[left]
  }
})
</script>

<template>
  <div flex flex-col gap-3>
    <div
      class="text-base text-[#3c3c43] font-semibold dark:text-[#fffff5]/[.86]"
    >
      Define Plugin
    </div>

    <div class="flex gap-2">
      <Input
        v-model="leftValue"
        class="h-9 flex-1 border-[#e2e2e3] rounded-lg p-2 text-xs transition-colors dark:border-[#2e2e32] focus:border-[#3451b2] dark:focus:border-[#a8b1ff]"
        placeholder="Key"
      />
      <Input
        v-model="rightValue"
        class="h-9 flex-1 border-[#e2e2e3] rounded-lg p-2 text-xs transition-colors dark:border-[#2e2e32] focus:border-[#3451b2] dark:focus:border-[#a8b1ff]"
        placeholder="Value"
      />
    </div>
  </div>
</template>
