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
    <div font-medium>Parser</div>

    <label flex items-center gap-2 text-sm>
      <span text-secondary-foreground>Extension</span>
      <Input v-model="options.parser.extension" class="h-8 p-1" />
    </label>

    <div text-sm>
      <button @click="handleShowOptions">Options</button>
    </div>

    <div v-if="showOptions" flex flex-col gap-2>
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
