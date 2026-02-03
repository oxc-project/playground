<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useOxc } from "~/composables/oxc";
import { Checkbox } from "~/ui/checkbox";
import { Switch } from "~/ui/switch";
import {
  LINT_PLUGINS,
  getFullRuleName,
  getRequiredPlugins,
} from "~/utils/linter-rules";

const { options } = await useOxc();

const showRules = ref(false);
const expandedPlugins = ref<Set<string>>(new Set());

// Track which rules are enabled by the user (using array for better reactivity)
const enabledRules = ref<string[]>([]);

function toggleRules() {
  showRules.value = !showRules.value;
}

function togglePlugin(pluginId: string) {
  if (expandedPlugins.value.has(pluginId)) {
    expandedPlugins.value.delete(pluginId);
  } else {
    expandedPlugins.value.add(pluginId);
  }
}

function isPluginExpanded(pluginId: string): boolean {
  return expandedPlugins.value.has(pluginId);
}

function isRuleEnabled(pluginId: string, ruleName: string): boolean {
  return enabledRules.value.includes(getFullRuleName(pluginId, ruleName));
}

function toggleRule(pluginId: string, ruleName: string) {
  const fullName = getFullRuleName(pluginId, ruleName);
  const index = enabledRules.value.indexOf(fullName);
  if (index >= 0) {
    enabledRules.value.splice(index, 1);
  } else {
    enabledRules.value.push(fullName);
  }
  updateLinterConfig();
}

function getEnabledRulesForPlugin(pluginId: string): number {
  return enabledRules.value.filter((rule) => rule.startsWith(`${pluginId}/`))
    .length;
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

  const config: Record<string, unknown> = { rules };

  // Only add plugins if there are non-default plugins required
  if (requiredPlugins.length > 0) {
    // We need to include default plugins + required non-default plugins
    const defaultPlugins = LINT_PLUGINS.filter((p) => p.isDefault).map(
      (p) => p.id,
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
    options.value.linter = { config };
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
      class="flex max-h-96 flex-col gap-1 overflow-y-auto"
      role="region"
      aria-label="Linter rules"
    >
      <div
        v-for="plugin in LINT_PLUGINS"
        :key="plugin.id"
        class="flex flex-col"
      >
        <button
          type="button"
          class="flex items-center gap-1 rounded px-1 py-0.5 text-left text-sm transition-colors hover:bg-muted"
          :aria-expanded="isPluginExpanded(plugin.id)"
          @click="togglePlugin(plugin.id)"
        >
          <Icon
            icon="ri:arrow-right-s-line"
            class="h-4 w-4 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-90': isPluginExpanded(plugin.id) }"
          />
          <span class="font-medium">{{ plugin.name }}</span>
          <span
            v-if="getEnabledRulesForPlugin(plugin.id) > 0"
            class="ml-1 rounded-full bg-primary/10 px-1.5 text-xs text-primary"
          >
            {{ getEnabledRulesForPlugin(plugin.id) }}
          </span>
          <span
            v-if="plugin.isDefault"
            class="ml-auto text-xs text-muted-foreground"
          >
            default
          </span>
        </button>

        <div
          v-if="isPluginExpanded(plugin.id)"
          class="ml-3 flex flex-col gap-0.5 border-l border-border pl-2"
        >
          <label
            v-for="rule in plugin.rules"
            :key="rule.name"
            class="flex cursor-pointer items-center gap-1.5 rounded px-1 py-0.5 transition-colors hover:bg-muted"
            :title="`Category: ${rule.category}`"
          >
            <Checkbox
              :checked="isRuleEnabled(plugin.id, rule.name)"
              class="h-3.5 w-3.5"
              @update:checked="toggleRule(plugin.id, rule.name)"
            />
            <span class="truncate font-mono text-xs">{{ rule.name }}</span>
          </label>
        </div>
      </div>
    </div>
  </section>
</template>
