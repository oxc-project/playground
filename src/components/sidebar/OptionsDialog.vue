<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useOxc } from "~/composables/oxc";
import { Button } from "~/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/ui/dialog";
import MonacoEditor from "../MonacoEditor.vue";

const { options } = await useOxc();
const optionsString = computed({
  get: () => JSON.stringify(options.value, null, 2),
  set: (value: string) => {
    try {
      options.value = JSON.parse(value);
    } catch (error) {
      console.error("Failed to parse JSON options:", error);
    }
  },
});
</script>

<template>
  <section aria-label="Advanced options">
    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline" class="w-full gap-2">
          <Icon icon="ri:settings-line" aria-hidden="true" />
          <span>Edit as JSON</span>
        </Button>
      </DialogTrigger>

      <DialogContent class="h-[80vh] max-w-5xl">
        <DialogHeader>
          <DialogTitle class="text-center">
            Oxc Options
          </DialogTitle>
        </DialogHeader>

        <MonacoEditor v-model="optionsString" language="json" filename="/options.json" />
      </DialogContent>
    </Dialog>
  </section>
</template>
