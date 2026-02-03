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

import rules from "../generated/linter-rules.json" with { type: "json" };

/**
 * Normalizes the raw `vite lint --rules --format=json` output into the shape
 * expected by the playground UI. We keep a small TypeScript wrapper so other
 * modules don't need to change.
 */
// The raw JSON emitted by `pnpm vite lint --rules --format=json` is an
// array of rule entries like: { scope, value, category, type_aware, default }
// We group by 'scope' to reconstruct the plugin structure the UI expects.
function normalizePluginFromItems(scope: string, items: any[]): LintPlugin {
  const id = scope || "unknown";
  const name = scope === "eslint" ? "ESLint" : scope.charAt(0).toUpperCase() + scope.slice(1);
  const isDefault = (items || []).some((r) => r && r.default === true);

  const rules: LintRule[] = (items || [])
    .filter((r: any) => r && !r.type_aware) // exclude type-aware rules
    .map((r: any) => ({ name: r.value, category: r.category || "unknown" }));

  return { id, name, isDefault, rules };
}

function loadPluginsFromJson(): LintPlugin[] {
  const groups = new Map<string, any[]>();

  for (const rule of rules || []) {
    const scope = rule.scope || "eslint";
    if (!groups.has(scope)) groups.set(scope, []);
    groups.get(scope)!.push(rule);
  }

  const plugins: LintPlugin[] = Array.from(groups.entries()).map(([scope, arr]) =>
    normalizePluginFromItems(scope, arr),
  );

  // Keep ESLint first for convenience, then sort by id
  plugins.sort((a, b) => (a.id === "eslint" ? -1 : a.id.localeCompare(b.id)));
  return plugins;
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
