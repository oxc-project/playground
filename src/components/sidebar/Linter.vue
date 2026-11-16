<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useOxc } from "~/composables/oxc";
import { enabledLintRules } from "~/composables/state";
import { Button } from "~/ui/button";
import OptionsDisclosure from "./OptionsDisclosure.vue";
import { Input } from "~/ui/input";
import { Checkbox as CheckboxControl } from "~/ui/checkbox";
import { LINT_PLUGINS, getFullRuleName } from "~/utils/linter-rules";

const { options } = await useOxc();
const searchQuery = ref("");
const enabledRules = enabledLintRules;

const allRules = LINT_PLUGINS.flatMap((plugin) =>
  plugin.rules.map((rule) => ({
    fullName: getFullRuleName(plugin.id, rule.name),
    plugin: plugin.name,
    name: rule.name,
    category: rule.category,
  })),
);

const filteredRules = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return [];
  return allRules
    .filter(
      (rule) =>
        !enabledRules.value.includes(rule.fullName) &&
        (rule.fullName.toLowerCase().includes(query) ||
          rule.name.toLowerCase().includes(query) ||
          rule.plugin.toLowerCase().includes(query)),
    )
    .slice(0, 20);
});

function addRule(fullName: string) {
  if (!enabledRules.value.includes(fullName)) enabledRules.value.push(fullName);
  searchQuery.value = "";
}

function removeRule(fullName: string) {
  const index = enabledRules.value.indexOf(fullName);
  if (index >= 0) enabledRules.value.splice(index, 1);
}
</script>

<template>
  <section class="settings-section" aria-labelledby="linter-heading">
    <div class="settings-toggle-row">
      <h2 id="linter-heading">Linter</h2>
      <CheckboxControl v-model:checked="options.run.lint" aria-labelledby="linter-heading" />
    </div>
    <OptionsDisclosure :label="enabledRules.length ? `Rules (${enabledRules.length})` : 'Rules'">
      <div class="flex min-w-0 flex-col gap-3">
        <Input
          v-model="searchQuery"
          type="search"
          placeholder="Search rules…"
          aria-label="Search lint rules"
        />
        <div
          v-if="searchQuery.trim()"
          class="max-h-64 overflow-y-auto rounded-md border border-border"
          aria-label="Matching lint rules"
        >
          <button
            v-for="rule in filteredRules"
            :key="rule.fullName"
            type="button"
            class="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent"
            :aria-label="`Add ${rule.fullName}`"
            @click="addRule(rule.fullName)"
          >
            <span class="min-w-0 break-all font-mono text-xs">{{ rule.fullName }}</span>
            <Icon icon="ri:add-line" class="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
          <p v-if="!filteredRules.length" class="px-3 py-4 text-sm text-muted-foreground">
            No matching rules found.
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <h3 class="text-xs font-medium text-muted-foreground">
            Selected rules <span class="ml-1 font-mono">{{ enabledRules.length }}</span>
          </h3>
          <div
            v-for="rule in enabledRules"
            :key="rule"
            class="flex items-center justify-between gap-2 rounded-md bg-muted px-3 py-2"
          >
            <span class="min-w-0 break-all font-mono text-xs">{{ rule }}</span>
            <Button
              variant="ghost"
              size="icon"
              class="h-6 w-6 shrink-0"
              :aria-label="`Remove ${rule}`"
              @click="removeRule(rule)"
            >
              <Icon icon="ri:close-line" />
            </Button>
          </div>
          <p v-if="!enabledRules.length" class="py-3 text-sm text-muted-foreground">
            No rules selected.
          </p>
        </div>
      </div>
    </OptionsDisclosure>
  </section>
</template>
