<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useOxc } from "~/composables/oxc";
import { enabledLintRules } from "~/composables/state";
import { Input } from "~/ui/input";
import { Switch } from "~/ui/switch";
import {
  LINT_PLUGINS,
  getFullRuleName,
  getRequiredPlugins,
} from "~/utils/linter-rules";

const { options } = await useOxc();

const showRules = ref(false);
const searchQuery = ref("");
const showDropdown = ref(false);

// Use global state for enabled rules
const enabledRules = enabledLintRules;

// Build a flat list of all rules with their full names
const allRules = computed(() => {
  const rules: Array<{ fullName: string; plugin: string; name: string; category: string }> = [];
  for (const plugin of LINT_PLUGINS) {
    for (const rule of plugin.rules) {
      rules.push({
        fullName: getFullRuleName(plugin.id, rule.name),
        plugin: plugin.name,
        name: rule.name,
        category: rule.category,
      });
    }
  }
  return rules;
});

// Filter rules based on search query, excluding already enabled rules
const filteredRules = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return [];

  return allRules.value
    .filter(
      (rule) =>
        !enabledRules.value.includes(rule.fullName) &&
        (rule.fullName.toLowerCase().includes(query) ||
          rule.name.toLowerCase().includes(query) ||
          rule.plugin.toLowerCase().includes(query))
    )
    .slice(0, 20); // Limit to 20 results for performance
});

function toggleRules() {
  showRules.value = !showRules.value;
}

function addRule(fullName: string) {
  if (!enabledRules.value.includes(fullName)) {
    enabledRules.value.push(fullName);
    updateLinterConfig();
  }
  searchQuery.value = "";
  // Keep dropdown open so user can continue adding rules
}

function removeRule(fullName: string) {
  const index = enabledRules.value.indexOf(fullName);
  if (index >= 0) {
    enabledRules.value.splice(index, 1);
    updateLinterConfig();
  }
}

function onSearchFocus() {
  showDropdown.value = true;
}

function onSearchBlur() {
  // Delay hiding dropdown to allow click events on items
  setTimeout(() => {
    showDropdown.value = false;
  }, 150);
}

// Build the linter config object from enabled rules
const linterConfig = computed(() => {
  if (enabledRules.value.length === 0) {
    return {};
  }

  const requiredPlugins = getRequiredPlugins(enabledRules.value);
  const rules: Record<string, string> = {};

  for (const rule of enabledRules.value) {
    rules[rule] = "error";
  }

  const config: Record<string, unknown> = {
    // Disable default correctness rules so only explicitly enabled rules are active
    categories: { correctness: "off" },
    rules,
  };

  // Only add plugins if there are non-default plugins required
  if (requiredPlugins.length > 0) {
    // We need to include default plugins + required non-default plugins
    const defaultPlugins = LINT_PLUGINS.filter((p) => p.isDefault).map(
      (p) => p.id
    );
    config.plugins = [...defaultPlugins, ...requiredPlugins];
  }

  return config;
});

function updateLinterConfig() {
  const config = linterConfig.value;
  if (Object.keys(config).length === 0) {
    options.value.linter = {};
  } else {
    options.value.linter = { config: JSON.stringify(config) };
  }
}
</script>

<template>
  <section class="flex flex-col gap-3" aria-labelledby="linter-heading">
    <label class="flex items-center gap-2">
      <Switch v-model:checked="options.run.lint" />
      <h2 id="linter-heading" class="text-base font-medium">Linter</h2>
    </label>

    <button
      type="button"
      class="flex items-center gap-1 text-sm text-secondary-foreground transition-colors hover:text-foreground"
      :aria-expanded="showRules"
      aria-controls="linter-rules"
      @click="toggleRules"
    >
      <Icon
        icon="ri:arrow-right-s-line"
        class="transition-transform duration-200"
        :class="{ 'rotate-90': showRules }"
      />
      <span>Rules</span>
      <span
        v-if="enabledRules.length > 0"
        class="ml-1 rounded-full bg-primary/10 px-1.5 text-xs text-primary"
      >
        {{ enabledRules.length }}
      </span>
    </button>

    <div
      v-if="showRules"
      id="linter-rules"
      class="flex flex-col gap-2"
      role="region"
      aria-label="Linter rules"
    >
      <!-- Search input with dropdown -->
      <div class="relative">
        <Input
          v-model="searchQuery"
          type="text"
          placeholder="Search rules..."
          class="h-8 text-xs"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        />

        <!-- Dropdown list -->
        <div
          v-if="showDropdown && searchQuery && filteredRules.length > 0"
          class="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md"
        >
          <button
            v-for="rule in filteredRules"
            :key="rule.fullName"
            type="button"
            class="flex w-full flex-col gap-0.5 px-2 py-1.5 text-left transition-colors hover:bg-muted"
            @mousedown.prevent="addRule(rule.fullName)"
          >
            <span class="font-mono text-xs">{{ rule.fullName }}</span>
            <span class="text-xs text-muted-foreground">{{ rule.category }}</span>
          </button>
        </div>

        <!-- No results message -->
        <div
          v-if="showDropdown && searchQuery && filteredRules.length === 0"
          class="absolute left-0 right-0 top-full z-10 mt-1 rounded-md border border-border bg-popover p-2 text-xs text-muted-foreground shadow-md"
        >
          No matching rules found
        </div>
      </div>

      <!-- Enabled rules list -->
      <div v-if="enabledRules.length > 0" class="flex flex-col gap-1">
        <div
          v-for="rule in enabledRules"
          :key="rule"
          class="flex items-center justify-between gap-1 rounded bg-muted px-2 py-1"
        >
          <span class="truncate font-mono text-xs">{{ rule }}</span>
          <button
            type="button"
            class="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
            :aria-label="`Remove ${rule}`"
            @click="removeRule(rule)"
          >
            <Icon icon="ri:close-line" class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <p
        v-else
        class="text-xs text-muted-foreground"
      >
        Search and add rules above
      </p>
    </div>
  </section>
</template>
