<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import { Button } from "~/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/ui/dialog";
import { Input } from "~/ui/input";
import { Switch } from "~/ui/switch";

const { options } = await useOxc();

const excludedProperties = computed({
  get: () => options.value.mangleProps.exclude ?? "",
  set: (value: string | number) => {
    options.value.mangleProps.exclude = String(value) || undefined;
  },
});

const reservedProperties = computed({
  get: () => (options.value.mangleProps.reserved ?? []).join("\n"),
  set: (value: string) => {
    options.value.mangleProps.reserved = value ? value.split("\n") : [];
  },
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="flex items-center gap-2">
      <Switch v-model:checked="options.run.mangleProps" />
      <h3 class="text-base font-medium">Mangle Properties</h3>
    </label>

    <Dialog>
      <DialogTrigger as-child>
        <Button variant="outline" size="sm" class="self-start">
          <Icon icon="ri:settings-line" aria-hidden="true" />
          Configure properties
        </Button>
      </DialogTrigger>

      <DialogContent class="max-h-[85vh] w-[calc(100%-2rem)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Property mangling</DialogTitle>
          <DialogDescription>
            Choose which property names to rename. Changes apply immediately.
          </DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-5">
          <label class="flex flex-col gap-2 text-sm">
            <span class="font-medium">Include pattern</span>
            <Input v-model="options.mangleProps.include" class="font-mono" />
            <span class="text-xs text-muted-foreground">
              Rust regex. The default _$ matches names ending in an underscore.
            </span>
          </label>

          <label class="flex flex-col gap-2 text-sm">
            <span class="font-medium">Exclude pattern</span>
            <Input
              v-model="excludedProperties"
              class="font-mono"
              placeholder="Optional regex pattern"
            />
          </label>

          <label class="flex flex-col gap-2 text-sm">
            <span class="font-medium">Reserved names</span>
            <textarea
              v-model="reservedProperties"
              rows="3"
              class="w-full rounded-md border border-input bg-transparent px-3 py-2 font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="One property name per line"
            />
          </label>

          <div class="flex flex-col gap-2">
            <Checkbox v-model="options.mangleProps.quoted" label="Mangle quoted properties" />
            <p class="text-xs text-muted-foreground">
              Also rename quoted properties. Otherwise, quoted names are preserved.
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Checkbox v-model="options.mangleProps.debug" label="Readable debug names" />
            <p class="text-xs text-muted-foreground">Use names such as _$name$_.</p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
