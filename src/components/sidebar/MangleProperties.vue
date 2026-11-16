<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Checkbox from "~/components/ui/Checkbox.vue";
import { useOxc } from "~/composables/oxc";
import OptionsDisclosure from "~/components/sidebar/OptionsDisclosure.vue";
import { Input } from "~/ui/input";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";

const { options } = await useOxc();

// Keep editing text separate so normalization does not remove spaces or newlines
// while the user is still typing.
const excludeInput = ref(options.value.mangleProps.exclude ?? "");
const reservedInput = ref((options.value.mangleProps.reserved ?? []).join("\n"));

function normalizeExclude(value: string) {
  return value.trim() ? value : undefined;
}

function normalizeReserved(value: string) {
  return value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

const excludedProperties = computed({
  get: () => excludeInput.value,
  set: (value: string | number) => {
    excludeInput.value = String(value);
    options.value.mangleProps.exclude = normalizeExclude(excludeInput.value);
  },
});

const reservedProperties = computed({
  get: () => reservedInput.value,
  set: (value: string) => {
    reservedInput.value = value;
    options.value.mangleProps.reserved = normalizeReserved(value);
  },
});

// Reflect edits from the JSON options dialog without overwriting current drafts.
watch(
  () => options.value.mangleProps,
  (properties) => {
    if (normalizeExclude(excludeInput.value) !== properties.exclude) {
      excludeInput.value = properties.exclude ?? "";
    }
    if (
      JSON.stringify(normalizeReserved(reservedInput.value)) !==
      JSON.stringify(properties.reserved ?? [])
    ) {
      reservedInput.value = (properties.reserved ?? []).join("\n");
    }
  },
  { deep: true, flush: "sync" },
);
</script>

<template>
  <div class="settings-section">
    <div class="settings-toggle-row">
      <h3><label for="mangle-properties">Mangle properties</label></h3>
      <CheckboxControl id="mangle-properties" v-model:checked="options.run.mangleProps" />
    </div>

    <OptionsDisclosure v-show="options.run.mangleProps" label="Property options">
      <div class="flex flex-col gap-3">
        <p class="settings-help">Rename only properties you control.</p>
        <label class="settings-field-stacked">
          <span>Include pattern</span>
          <Input v-model="options.mangleProps.include" class="font-mono" />
          <span class="settings-help">
            Rust regex. <code>_$</code> matches names ending in an underscore.
          </span>
        </label>

        <label class="settings-field-stacked">
          <span>Exclude pattern</span>
          <Input v-model="excludedProperties" class="font-mono" placeholder="Optional Rust regex" />
        </label>

        <label class="settings-field-stacked">
          <span>Reserved names</span>
          <textarea
            v-model="reservedProperties"
            rows="3"
            class="w-full rounded border border-input bg-background px-2 py-1.5 font-mono text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="One property name per line"
          />
        </label>

        <div class="flex flex-col gap-1">
          <Checkbox v-model="options.mangleProps.quoted" label="Mangle quoted properties" />
          <p class="settings-help">Otherwise, quoted names are preserved.</p>
        </div>

        <div class="flex flex-col gap-1">
          <Checkbox v-model="options.mangleProps.debug" label="Readable debug names" />
          <p class="settings-help">Use names such as <code>_$name$_</code>.</p>
        </div>
      </div>
    </OptionsDisclosure>
  </div>
</template>
