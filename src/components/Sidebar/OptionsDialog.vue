<script setup lang="ts">
import { useOxc } from 'src/composables/oxc'
import { Button } from 'src/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/ui/dialog'
import { computed } from 'vue'
import Monaco from '../Editor/Monaco.vue'

const { options } = await useOxc()
const optionsString = computed({
  get: () => JSON.stringify(options.value, null, 2),
  set: (value: string) => {
    try {
      options.value = JSON.parse(value)
    } catch (error) {
      console.error(error)
    }
  },
})
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline" class="gap2">
        <div i-ri:settings-line />
        Edit as JSON
      </Button>
    </DialogTrigger>

    <DialogContent class="h-[80vh] max-w-5xl">
      <DialogHeader>
        <DialogTitle class="text-center">Oxc Options</DialogTitle>
      </DialogHeader>

      <Monaco
        v-model="optionsString"
        language="json"
        filename="/options.json"
      />
    </DialogContent>
  </Dialog>
</template>
