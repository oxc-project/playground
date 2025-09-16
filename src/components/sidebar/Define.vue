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
    <div font-small>Define Plugin</div>

    <div flex gap-2>
      <Input v-model="leftValue" class="h-8 flex-1 p-1" placeholder="Key" />
      <Input v-model="rightValue" class="h-8 flex-1 p-1" placeholder="Value" />
    </div>
  </div>
</template>
