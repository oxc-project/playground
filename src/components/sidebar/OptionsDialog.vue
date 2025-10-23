<script setup lang="ts">
import { computed } from 'vue'
import { useOxc } from '~/composables/oxc'
import { Button } from '~/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/ui/dialog'
import MonacoEditor from '../MonacoEditor.vue'

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
      <Button
        variant="outline"
        class="group gap-2 border-[#e2e2e3] shadow-sm transition-all dark:border-[#2e2e32] hover:border-[#3451b2] hover:from-blue-50/50 hover:to-purple-50/50 hover:bg-gradient-to-r dark:hover:border-[#a8b1ff] dark:hover:from-blue-950/20 dark:hover:to-purple-950/20"
      >
        <div
          class="i-ri:settings-line transition-transform duration-300 group-hover:rotate-90"
        />
        <span class="font-medium">Edit as JSON</span>
      </Button>
    </DialogTrigger>

    <DialogContent
      class="h-[80vh] max-w-5xl border-[#e2e2e3] rounded-xl shadow-2xl dark:border-[#2e2e32]"
    >
      <DialogHeader>
        <DialogTitle
          class="from-blue-600 to-purple-600 bg-gradient-to-r bg-clip-text text-center text-xl text-transparent font-semibold dark:from-blue-400 dark:to-purple-400"
          >Oxc Options</DialogTitle
        >
      </DialogHeader>

      <MonacoEditor
        v-model="optionsString"
        language="json"
        filename="/options.json"
        class="overflow-hidden rounded-lg"
      />
    </DialogContent>
  </Dialog>
</template>
