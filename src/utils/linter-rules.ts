/**
 * Oxlint rules data structure for the playground UI.
 * Generated from `pnpm vite lint --rules --format=json` (run `pnpm run generate:linter-rules` to update)
 * Type-aware rules are excluded as they are not supported in the playground.
 */

export interface LintRule {
  name: string;
  category: string;
}

export interface LintPlugin {
  id: string;
  name: string;
  isDefault: boolean;
  rules: LintRule[];
}

import rulesRaw from "../generated/linter-rules.json";

/**
 * Normalizes the raw `vite lint --rules --format=json` output into the shape
 * expected by the playground UI. We keep a small TypeScript wrapper so other
 * modules don't need to change.
 */
function normalizePlugin(plugin: any): LintPlugin {
  const id = plugin.id || plugin.name?.toLowerCase()?.replace(/\s+/g, "-") || "unknown";
  const name = plugin.name || plugin.id || id;
  const isDefault = !!(plugin.isDefault || plugin.default || plugin.is_default);

  const rulesSrc = plugin.rules || plugin.rulesMeta || plugin.meta?.rules || [];
  const rules: LintRule[] = (rulesSrc || [])
    .filter((r: any) => {
      if (!r) return false;
      if (r.requiresTypeInformation || r.requiresType || r.type === "type-aware") return false;
      if (r.meta?.docs?.requiresTypeChecking) return false;
      return true;
    })
    .map((r: any) => ({
      name: r.name,
      category: r.category || r.meta?.category || r.meta?.docs?.category || "unknown",
    }));

  return { id, name, isDefault, rules };
}

function loadPluginsFromJson(): LintPlugin[] {
  const data = Array.isArray(rulesRaw) ? rulesRaw : rulesRaw.plugins || rulesRaw;
  return (data || []).map(normalizePlugin);
}

export const LINT_PLUGINS: LintPlugin[] = loadPluginsFromJson();

/**
 * Get the plugin ID for a rule.
 * Returns the plugin part of rules like "eslint/no-console" -> "eslint"
 */
export function getPluginForRule(fullRuleName: string): string {
  const slashIndex = fullRuleName.indexOf("/");
  return slashIndex === -1 ? "eslint" : fullRuleName.substring(0, slashIndex);
}

/**
 * Get the full rule name with plugin prefix.
 */
export function getFullRuleName(pluginId: string, ruleName: string): string {
  return `${pluginId}/${ruleName}`;
}

/**
 * Get all required plugins for a set of enabled rules.
 */
export function getRequiredPlugins(enabledRules: string[]): string[] {
  const requiredPlugins = new Set<string>();
  const defaultPlugins = new Set(LINT_PLUGINS.filter((p) => p.isDefault).map((p) => p.id));

  for (const rule of enabledRules) {
    const plugin = getPluginForRule(rule);
    // Only add non-default plugins
    if (!defaultPlugins.has(plugin)) {
      requiredPlugins.add(plugin);
    }
  }

  return Array.from(requiredPlugins);
}
