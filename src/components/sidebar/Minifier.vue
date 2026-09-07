<script setup lang="ts">
import { computed } from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
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
  <section class="flex flex-col gap-4" aria-labelledby="minifier-heading">
    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.compress" />
        <h2 id="minifier-heading" class="text-base font-medium">Minify Syntax</h2>
      </label>
    </div>

    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.whitespace" />
        <h3 class="text-base font-medium">Minify Whitespace</h3>
      </label>
    </div>

    <div class="flex flex-col gap-3">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.mangle" />
        <h3 class="text-base font-medium">Mangle Names</h3>
      </label>

      <div class="ml-2 flex flex-col gap-2">
        <Checkbox
          v-model="options.mangle.topLevel"
          default-checked
          label="topLevel"
          label-class="text-xs font-mono"
        />

        <Checkbox
          v-model="options.mangle.keepNames"
          default-checked
          label="keepNames"
          label-class="text-xs font-mono"
        />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <label class="flex items-center gap-2">
        <Switch v-model:checked="options.run.mangleProps" />
        <h3 class="text-base font-medium">Mangle Properties</h3>
      </label>

      <div class="ml-2 flex flex-col gap-2">
        <label class="flex flex-col gap-1 text-xs">
          <span class="font-mono">include</span>
          <Input v-model="options.mangleProps.include" class="h-8 p-1 font-mono" />
          <span class="text-muted-foreground">
            Regex pattern. The default _$ matches properties ending in an underscore.
          </span>
        </label>

        <label class="flex flex-col gap-1 text-xs">
          <span class="font-mono">exclude</span>
          <Input
            v-model="excludedProperties"
            class="h-8 p-1 font-mono"
            placeholder="Optional regex pattern"
          />
        </label>

        <label class="flex flex-col gap-1 text-xs">
          <span class="font-mono">reserved</span>
          <textarea
            v-model="reservedProperties"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent p-1 font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="One property name per line"
          />
        </label>

        <Checkbox
          v-model="options.mangleProps.quoted"
          label="quoted"
          label-class="text-xs font-mono"
        />
        <p class="text-xs text-muted-foreground">
          Also mangle quoted properties. Otherwise, quoted names are preserved.
        </p>
        <Checkbox
          v-model="options.mangleProps.debug"
          label="debug"
          label-class="text-xs font-mono"
        />
        <p class="text-xs text-muted-foreground">Use readable names such as _$name$_.</p>
      </div>
    </div>
  </section>
</template>
