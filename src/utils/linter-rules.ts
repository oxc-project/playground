/**
 * Oxlint rules data structure for the playground UI.
 * Generated from oxlint --rules --format=json
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

export const LINT_PLUGINS: LintPlugin[] = [
  {
    id: "eslint",
    name: "ESLint",
    isDefault: true,
    rules: [
      {
        name: "accessor-pairs",
        category: "pedantic",
      },
      {
        name: "array-callback-return",
        category: "pedantic",
      },
      {
        name: "arrow-body-style",
        category: "style",
      },
      {
        name: "block-scoped-var",
        category: "suspicious",
      },
      {
        name: "capitalized-comments",
        category: "style",
      },
      {
        name: "class-methods-use-this",
        category: "restriction",
      },
      {
        name: "complexity",
        category: "restriction",
      },
      {
        name: "constructor-super",
        category: "correctness",
      },
      {
        name: "curly",
        category: "style",
      },
      {
        name: "default-case",
        category: "restriction",
      },
      {
        name: "default-case-last",
        category: "style",
      },
      {
        name: "default-param-last",
        category: "style",
      },
      {
        name: "eqeqeq",
        category: "pedantic",
      },
      {
        name: "for-direction",
        category: "correctness",
      },
      {
        name: "func-style",
        category: "style",
      },
      {
        name: "func-names",
        category: "style",
      },
      {
        name: "getter-return",
        category: "nursery",
      },
      {
        name: "grouped-accessor-pairs",
        category: "style",
      },
      {
        name: "guard-for-in",
        category: "style",
      },
      {
        name: "id-length",
        category: "style",
      },
      {
        name: "init-declarations",
        category: "style",
      },
      {
        name: "max-classes-per-file",
        category: "pedantic",
      },
      {
        name: "max-depth",
        category: "pedantic",
      },
      {
        name: "max-lines-per-function",
        category: "pedantic",
      },
      {
        name: "max-lines",
        category: "pedantic",
      },
      {
        name: "max-nested-callbacks",
        category: "pedantic",
      },
      {
        name: "max-params",
        category: "style",
      },
      {
        name: "max-statements",
        category: "style",
      },
      {
        name: "new-cap",
        category: "style",
      },
      {
        name: "no-implicit-coercion",
        category: "style",
      },
      {
        name: "no-inline-comments",
        category: "pedantic",
      },
      {
        name: "no-loop-func",
        category: "pedantic",
      },
      {
        name: "no-useless-computed-key",
        category: "style",
      },
      {
        name: "no-unassigned-vars",
        category: "correctness",
      },
      {
        name: "no-extra-bind",
        category: "suspicious",
      },
      {
        name: "no-alert",
        category: "restriction",
      },
      {
        name: "no-array-constructor",
        category: "pedantic",
      },
      {
        name: "no-async-promise-executor",
        category: "correctness",
      },
      {
        name: "no-await-in-loop",
        category: "perf",
      },
      {
        name: "no-bitwise",
        category: "restriction",
      },
      {
        name: "no-caller",
        category: "correctness",
      },
      {
        name: "no-case-declarations",
        category: "pedantic",
      },
      {
        name: "no-class-assign",
        category: "correctness",
      },
      {
        name: "no-duplicate-imports",
        category: "style",
      },
      {
        name: "no-extra-label",
        category: "style",
      },
      {
        name: "no-labels",
        category: "style",
      },
      {
        name: "no-lone-blocks",
        category: "style",
      },
      {
        name: "no-lonely-if",
        category: "pedantic",
      },
      {
        name: "no-multi-assign",
        category: "style",
      },
      {
        name: "no-nested-ternary",
        category: "style",
      },
      {
        name: "no-object-constructor",
        category: "pedantic",
      },
      {
        name: "no-param-reassign",
        category: "restriction",
      },
      {
        name: "no-restricted-imports",
        category: "restriction",
      },
      {
        name: "no-unneeded-ternary",
        category: "suspicious",
      },
      {
        name: "no-useless-backreference",
        category: "correctness",
      },
      {
        name: "no-useless-call",
        category: "perf",
      },
      {
        name: "no-compare-neg-zero",
        category: "correctness",
      },
      {
        name: "no-cond-assign",
        category: "correctness",
      },
      {
        name: "no-console",
        category: "restriction",
      },
      {
        name: "no-const-assign",
        category: "correctness",
      },
      {
        name: "no-constant-binary-expression",
        category: "correctness",
      },
      {
        name: "no-constant-condition",
        category: "correctness",
      },
      {
        name: "no-constructor-return",
        category: "pedantic",
      },
      {
        name: "no-continue",
        category: "style",
      },
      {
        name: "no-control-regex",
        category: "correctness",
      },
      {
        name: "no-debugger",
        category: "correctness",
      },
      {
        name: "no-delete-var",
        category: "correctness",
      },
      {
        name: "no-div-regex",
        category: "restriction",
      },
      {
        name: "no-dupe-class-members",
        category: "correctness",
      },
      {
        name: "no-dupe-else-if",
        category: "correctness",
      },
      {
        name: "no-dupe-keys",
        category: "correctness",
      },
      {
        name: "no-duplicate-case",
        category: "correctness",
      },
      {
        name: "no-else-return",
        category: "pedantic",
      },
      {
        name: "no-empty-character-class",
        category: "correctness",
      },
      {
        name: "no-empty-function",
        category: "restriction",
      },
      {
        name: "no-empty-pattern",
        category: "correctness",
      },
      {
        name: "no-empty-static-block",
        category: "correctness",
      },
      {
        name: "no-empty",
        category: "restriction",
      },
      {
        name: "no-eq-null",
        category: "restriction",
      },
      {
        name: "no-eval",
        category: "correctness",
      },
      {
        name: "no-ex-assign",
        category: "correctness",
      },
      {
        name: "no-extend-native",
        category: "suspicious",
      },
      {
        name: "no-extra-boolean-cast",
        category: "correctness",
      },
      {
        name: "no-fallthrough",
        category: "pedantic",
      },
      {
        name: "no-func-assign",
        category: "correctness",
      },
      {
        name: "no-global-assign",
        category: "correctness",
      },
      {
        name: "no-import-assign",
        category: "correctness",
      },
      {
        name: "no-inner-declarations",
        category: "pedantic",
      },
      {
        name: "no-invalid-regexp",
        category: "correctness",
      },
      {
        name: "no-irregular-whitespace",
        category: "correctness",
      },
      {
        name: "no-iterator",
        category: "restriction",
      },
      {
        name: "no-label-var",
        category: "style",
      },
      {
        name: "no-loss-of-precision",
        category: "correctness",
      },
      {
        name: "no-magic-numbers",
        category: "style",
      },
      {
        name: "no-misleading-character-class",
        category: "nursery",
      },
      {
        name: "no-negated-condition",
        category: "pedantic",
      },
      {
        name: "no-multi-str",
        category: "style",
      },
      {
        name: "no-new-func",
        category: "style",
      },
      {
        name: "no-new-native-nonconstructor",
        category: "correctness",
      },
      {
        name: "no-new-wrappers",
        category: "pedantic",
      },
      {
        name: "no-new",
        category: "suspicious",
      },
      {
        name: "no-nonoctal-decimal-escape",
        category: "correctness",
      },
      {
        name: "no-obj-calls",
        category: "correctness",
      },
      {
        name: "no-plusplus",
        category: "restriction",
      },
      {
        name: "no-promise-executor-return",
        category: "pedantic",
      },
      {
        name: "no-proto",
        category: "restriction",
      },
      {
        name: "no-prototype-builtins",
        category: "pedantic",
      },
      {
        name: "no-redeclare",
        category: "pedantic",
      },
      {
        name: "no-regex-spaces",
        category: "restriction",
      },
      {
        name: "no-restricted-globals",
        category: "restriction",
      },
      {
        name: "no-return-assign",
        category: "style",
      },
      {
        name: "no-script-url",
        category: "style",
      },
      {
        name: "no-self-assign",
        category: "correctness",
      },
      {
        name: "no-self-compare",
        category: "pedantic",
      },
      {
        name: "no-sequences",
        category: "restriction",
      },
      {
        name: "no-setter-return",
        category: "correctness",
      },
      {
        name: "no-shadow-restricted-names",
        category: "correctness",
      },
      {
        name: "no-sparse-arrays",
        category: "correctness",
      },
      {
        name: "no-template-curly-in-string",
        category: "style",
      },
      {
        name: "no-ternary",
        category: "style",
      },
      {
        name: "no-this-before-super",
        category: "correctness",
      },
      {
        name: "no-throw-literal",
        category: "pedantic",
      },
      {
        name: "no-undef",
        category: "nursery",
      },
      {
        name: "no-undefined",
        category: "restriction",
      },
      {
        name: "no-unexpected-multiline",
        category: "suspicious",
      },
      {
        name: "no-unreachable",
        category: "nursery",
      },
      {
        name: "no-unsafe-finally",
        category: "correctness",
      },
      {
        name: "no-unsafe-negation",
        category: "correctness",
      },
      {
        name: "no-unsafe-optional-chaining",
        category: "correctness",
      },
      {
        name: "no-unused-expressions",
        category: "correctness",
      },
      {
        name: "no-unused-labels",
        category: "correctness",
      },
      {
        name: "no-unused-private-class-members",
        category: "correctness",
      },
      {
        name: "no-unused-vars",
        category: "correctness",
      },
      {
        name: "no-useless-catch",
        category: "correctness",
      },
      {
        name: "no-useless-concat",
        category: "suspicious",
      },
      {
        name: "no-useless-constructor",
        category: "suspicious",
      },
      {
        name: "no-useless-escape",
        category: "correctness",
      },
      {
        name: "no-useless-rename",
        category: "correctness",
      },
      {
        name: "no-useless-return",
        category: "pedantic",
      },
      {
        name: "no-var",
        category: "restriction",
      },
      {
        name: "no-void",
        category: "restriction",
      },
      {
        name: "no-warning-comments",
        category: "pedantic",
      },
      {
        name: "no-with",
        category: "correctness",
      },
      {
        name: "operator-assignment",
        category: "style",
      },
      {
        name: "prefer-template",
        category: "style",
      },
      {
        name: "prefer-destructuring",
        category: "style",
      },
      {
        name: "prefer-promise-reject-errors",
        category: "style",
      },
      {
        name: "prefer-exponentiation-operator",
        category: "style",
      },
      {
        name: "prefer-numeric-literals",
        category: "style",
      },
      {
        name: "prefer-object-has-own",
        category: "style",
      },
      {
        name: "prefer-object-spread",
        category: "style",
      },
      {
        name: "prefer-rest-params",
        category: "style",
      },
      {
        name: "prefer-spread",
        category: "style",
      },
      {
        name: "preserve-caught-error",
        category: "suspicious",
      },
      {
        name: "radix",
        category: "pedantic",
      },
      {
        name: "require-await",
        category: "pedantic",
      },
      {
        name: "require-yield",
        category: "correctness",
      },
      {
        name: "sort-imports",
        category: "style",
      },
      {
        name: "sort-keys",
        category: "style",
      },
      {
        name: "sort-vars",
        category: "pedantic",
      },
      {
        name: "symbol-description",
        category: "pedantic",
      },
      {
        name: "unicode-bom",
        category: "restriction",
      },
      {
        name: "use-isnan",
        category: "correctness",
      },
      {
        name: "valid-typeof",
        category: "correctness",
      },
      {
        name: "vars-on-top",
        category: "style",
      },
      {
        name: "yoda",
        category: "style",
      },
    ],
  },
  {
    id: "import",
    name: "Import",
    isDefault: false,
    rules: [
      {
        name: "consistent-type-specifier-style",
        category: "style",
      },
      {
        name: "default",
        category: "correctness",
      },
      {
        name: "export",
        category: "nursery",
      },
      {
        name: "exports-last",
        category: "style",
      },
      {
        name: "extensions",
        category: "restriction",
      },
      {
        name: "first",
        category: "style",
      },
      {
        name: "group-exports",
        category: "style",
      },
      {
        name: "no-named-export",
        category: "style",
      },
      {
        name: "no-unassigned-import",
        category: "suspicious",
      },
      {
        name: "no-empty-named-blocks",
        category: "suspicious",
      },
      {
        name: "no-anonymous-default-export",
        category: "style",
      },
      {
        name: "no-absolute-path",
        category: "suspicious",
      },
      {
        name: "no-mutable-exports",
        category: "style",
      },
      {
        name: "no-named-default",
        category: "style",
      },
      {
        name: "no-namespace",
        category: "style",
      },
      {
        name: "max-dependencies",
        category: "pedantic",
      },
      {
        name: "named",
        category: "nursery",
      },
      {
        name: "namespace",
        category: "correctness",
      },
      {
        name: "no-amd",
        category: "restriction",
      },
      {
        name: "no-commonjs",
        category: "restriction",
      },
      {
        name: "no-cycle",
        category: "restriction",
      },
      {
        name: "no-default-export",
        category: "restriction",
      },
      {
        name: "no-duplicates",
        category: "style",
      },
      {
        name: "no-dynamic-require",
        category: "restriction",
      },
      {
        name: "no-named-as-default",
        category: "suspicious",
      },
      {
        name: "no-named-as-default-member",
        category: "suspicious",
      },
      {
        name: "no-self-import",
        category: "suspicious",
      },
      {
        name: "no-webpack-loader-syntax",
        category: "restriction",
      },
      {
        name: "prefer-default-export",
        category: "style",
      },
      {
        name: "unambiguous",
        category: "restriction",
      },
    ],
  },
  {
    id: "jest",
    name: "Jest",
    isDefault: false,
    rules: [
      {
        name: "consistent-test-it",
        category: "style",
      },
      {
        name: "expect-expect",
        category: "correctness",
      },
      {
        name: "max-expects",
        category: "style",
      },
      {
        name: "max-nested-describe",
        category: "style",
      },
      {
        name: "no-alias-methods",
        category: "style",
      },
      {
        name: "no-commented-out-tests",
        category: "suspicious",
      },
      {
        name: "no-conditional-expect",
        category: "correctness",
      },
      {
        name: "no-conditional-in-test",
        category: "pedantic",
      },
      {
        name: "no-confusing-set-timeout",
        category: "style",
      },
      {
        name: "no-deprecated-functions",
        category: "style",
      },
      {
        name: "no-disabled-tests",
        category: "correctness",
      },
      {
        name: "no-done-callback",
        category: "style",
      },
      {
        name: "no-duplicate-hooks",
        category: "style",
      },
      {
        name: "no-export",
        category: "correctness",
      },
      {
        name: "no-focused-tests",
        category: "correctness",
      },
      {
        name: "no-hooks",
        category: "style",
      },
      {
        name: "no-identical-title",
        category: "style",
      },
      {
        name: "no-interpolation-in-snapshots",
        category: "style",
      },
      {
        name: "no-jasmine-globals",
        category: "style",
      },
      {
        name: "no-large-snapshots",
        category: "style",
      },
      {
        name: "no-mocks-import",
        category: "style",
      },
      {
        name: "no-restricted-jest-methods",
        category: "style",
      },
      {
        name: "no-restricted-matchers",
        category: "style",
      },
      {
        name: "no-standalone-expect",
        category: "correctness",
      },
      {
        name: "no-test-prefixes",
        category: "style",
      },
      {
        name: "no-test-return-statement",
        category: "style",
      },
      {
        name: "no-untyped-mock-factory",
        category: "style",
      },
      {
        name: "padding-around-test-blocks",
        category: "style",
      },
      {
        name: "prefer-each",
        category: "style",
      },
      {
        name: "prefer-called-with",
        category: "style",
      },
      {
        name: "prefer-comparison-matcher",
        category: "style",
      },
      {
        name: "prefer-equality-matcher",
        category: "style",
      },
      {
        name: "prefer-expect-resolves",
        category: "style",
      },
      {
        name: "prefer-hooks-in-order",
        category: "style",
      },
      {
        name: "prefer-hooks-on-top",
        category: "style",
      },
      {
        name: "prefer-jest-mocked",
        category: "style",
      },
      {
        name: "prefer-lowercase-title",
        category: "style",
      },
      {
        name: "prefer-mock-promise-shorthand",
        category: "style",
      },
      {
        name: "prefer-spy-on",
        category: "style",
      },
      {
        name: "prefer-strict-equal",
        category: "style",
      },
      {
        name: "prefer-to-be",
        category: "style",
      },
      {
        name: "prefer-to-contain",
        category: "style",
      },
      {
        name: "prefer-to-have-been-called",
        category: "style",
      },
      {
        name: "prefer-to-have-been-called-times",
        category: "style",
      },
      {
        name: "prefer-to-have-length",
        category: "style",
      },
      {
        name: "prefer-todo",
        category: "style",
      },
      {
        name: "require-hook",
        category: "style",
      },
      {
        name: "require-to-throw-message",
        category: "correctness",
      },
      {
        name: "require-top-level-describe",
        category: "style",
      },
      {
        name: "valid-describe-callback",
        category: "correctness",
      },
      {
        name: "valid-expect",
        category: "correctness",
      },
      {
        name: "valid-title",
        category: "correctness",
      },
    ],
  },
  {
    id: "jsdoc",
    name: "JSDoc",
    isDefault: false,
    rules: [
      {
        name: "check-access",
        category: "restriction",
      },
      {
        name: "check-property-names",
        category: "correctness",
      },
      {
        name: "check-tag-names",
        category: "correctness",
      },
      {
        name: "empty-tags",
        category: "restriction",
      },
      {
        name: "implements-on-classes",
        category: "correctness",
      },
      {
        name: "no-defaults",
        category: "correctness",
      },
      {
        name: "require-param",
        category: "pedantic",
      },
      {
        name: "require-param-description",
        category: "pedantic",
      },
      {
        name: "require-param-name",
        category: "pedantic",
      },
      {
        name: "require-param-type",
        category: "pedantic",
      },
      {
        name: "require-property",
        category: "correctness",
      },
      {
        name: "require-property-description",
        category: "correctness",
      },
      {
        name: "require-property-name",
        category: "correctness",
      },
      {
        name: "require-property-type",
        category: "correctness",
      },
      {
        name: "require-returns",
        category: "pedantic",
      },
      {
        name: "require-returns-description",
        category: "pedantic",
      },
      {
        name: "require-returns-type",
        category: "pedantic",
      },
      {
        name: "require-yields",
        category: "correctness",
      },
    ],
  },
  {
    id: "jsx-a11y",
    name: "JSX A11y",
    isDefault: false,
    rules: [
      {
        name: "alt-text",
        category: "correctness",
      },
      {
        name: "anchor-has-content",
        category: "correctness",
      },
      {
        name: "anchor-is-valid",
        category: "correctness",
      },
      {
        name: "aria-activedescendant-has-tabindex",
        category: "correctness",
      },
      {
        name: "aria-props",
        category: "correctness",
      },
      {
        name: "aria-proptypes",
        category: "correctness",
      },
      {
        name: "aria-role",
        category: "correctness",
      },
      {
        name: "aria-unsupported-elements",
        category: "correctness",
      },
      {
        name: "autocomplete-valid",
        category: "correctness",
      },
      {
        name: "click-events-have-key-events",
        category: "correctness",
      },
      {
        name: "heading-has-content",
        category: "correctness",
      },
      {
        name: "html-has-lang",
        category: "correctness",
      },
      {
        name: "iframe-has-title",
        category: "correctness",
      },
      {
        name: "img-redundant-alt",
        category: "correctness",
      },
      {
        name: "label-has-associated-control",
        category: "correctness",
      },
      {
        name: "lang",
        category: "correctness",
      },
      {
        name: "media-has-caption",
        category: "correctness",
      },
      {
        name: "mouse-events-have-key-events",
        category: "correctness",
      },
      {
        name: "no-noninteractive-tabindex",
        category: "correctness",
      },
      {
        name: "no-static-element-interactions",
        category: "nursery",
      },
      {
        name: "no-access-key",
        category: "correctness",
      },
      {
        name: "no-aria-hidden-on-focusable",
        category: "correctness",
      },
      {
        name: "no-autofocus",
        category: "correctness",
      },
      {
        name: "no-distracting-elements",
        category: "correctness",
      },
      {
        name: "no-redundant-roles",
        category: "correctness",
      },
      {
        name: "prefer-tag-over-role",
        category: "correctness",
      },
      {
        name: "role-has-required-aria-props",
        category: "correctness",
      },
      {
        name: "role-supports-aria-props",
        category: "correctness",
      },
      {
        name: "scope",
        category: "correctness",
      },
      {
        name: "tabindex-no-positive",
        category: "correctness",
      },
      {
        name: "anchor-ambiguous-text",
        category: "restriction",
      },
    ],
  },
  {
    id: "nextjs",
    name: "Next.js",
    isDefault: false,
    rules: [
      {
        name: "google-font-display",
        category: "correctness",
      },
      {
        name: "google-font-preconnect",
        category: "correctness",
      },
      {
        name: "inline-script-id",
        category: "correctness",
      },
      {
        name: "next-script-for-ga",
        category: "correctness",
      },
      {
        name: "no-assign-module-variable",
        category: "correctness",
      },
      {
        name: "no-async-client-component",
        category: "correctness",
      },
      {
        name: "no-before-interactive-script-outside-document",
        category: "correctness",
      },
      {
        name: "no-css-tags",
        category: "correctness",
      },
      {
        name: "no-document-import-in-page",
        category: "correctness",
      },
      {
        name: "no-duplicate-head",
        category: "correctness",
      },
      {
        name: "no-head-element",
        category: "correctness",
      },
      {
        name: "no-head-import-in-document",
        category: "correctness",
      },
      {
        name: "no-img-element",
        category: "correctness",
      },
      {
        name: "no-page-custom-font",
        category: "correctness",
      },
      {
        name: "no-script-component-in-head",
        category: "correctness",
      },
      {
        name: "no-styled-jsx-in-document",
        category: "correctness",
      },
      {
        name: "no-sync-scripts",
        category: "correctness",
      },
      {
        name: "no-title-in-document-head",
        category: "correctness",
      },
      {
        name: "no-typos",
        category: "correctness",
      },
      {
        name: "no-unwanted-polyfillio",
        category: "correctness",
      },
      {
        name: "no-html-link-for-pages",
        category: "correctness",
      },
    ],
  },
  {
    id: "node",
    name: "Node",
    isDefault: false,
    rules: [
      {
        name: "global-require",
        category: "style",
      },
      {
        name: "no-process-env",
        category: "restriction",
      },
      {
        name: "no-exports-assign",
        category: "style",
      },
      {
        name: "no-new-require",
        category: "restriction",
      },
    ],
  },
  {
    id: "oxc",
    name: "Oxc",
    isDefault: true,
    rules: [
      {
        name: "approx-constant",
        category: "suspicious",
      },
      {
        name: "bad-array-method-on-arguments",
        category: "correctness",
      },
      {
        name: "bad-bitwise-operator",
        category: "restriction",
      },
      {
        name: "bad-char-at-comparison",
        category: "correctness",
      },
      {
        name: "bad-comparison-sequence",
        category: "correctness",
      },
      {
        name: "bad-min-max-func",
        category: "correctness",
      },
      {
        name: "bad-object-literal-comparison",
        category: "correctness",
      },
      {
        name: "bad-replace-all-arg",
        category: "correctness",
      },
      {
        name: "branches-sharing-code",
        category: "nursery",
      },
      {
        name: "const-comparisons",
        category: "correctness",
      },
      {
        name: "double-comparisons",
        category: "correctness",
      },
      {
        name: "erasing-op",
        category: "correctness",
      },
      {
        name: "misrefactored-assign-op",
        category: "suspicious",
      },
      {
        name: "missing-throw",
        category: "correctness",
      },
      {
        name: "no-accumulating-spread",
        category: "perf",
      },
      {
        name: "no-async-await",
        category: "restriction",
      },
      {
        name: "no-async-endpoint-handlers",
        category: "suspicious",
      },
      {
        name: "no-barrel-file",
        category: "restriction",
      },
      {
        name: "no-const-enum",
        category: "restriction",
      },
      {
        name: "no-map-spread",
        category: "perf",
      },
      {
        name: "no-optional-chaining",
        category: "restriction",
      },
      {
        name: "no-rest-spread-properties",
        category: "restriction",
      },
      {
        name: "no-this-in-exported-function",
        category: "suspicious",
      },
      {
        name: "number-arg-out-of-range",
        category: "correctness",
      },
      {
        name: "only-used-in-recursion",
        category: "correctness",
      },
      {
        name: "uninvoked-array-callback",
        category: "correctness",
      },
    ],
  },
  {
    id: "promise",
    name: "Promise",
    isDefault: false,
    rules: [
      {
        name: "always-return",
        category: "suspicious",
      },
      {
        name: "avoid-new",
        category: "style",
      },
      {
        name: "catch-or-return",
        category: "restriction",
      },
      {
        name: "no-return-wrap",
        category: "style",
      },
      {
        name: "no-nesting",
        category: "style",
      },
      {
        name: "no-promise-in-callback",
        category: "suspicious",
      },
      {
        name: "no-callback-in-promise",
        category: "correctness",
      },
      {
        name: "no-multiple-resolved",
        category: "suspicious",
      },
      {
        name: "no-new-statics",
        category: "correctness",
      },
      {
        name: "no-return-in-finally",
        category: "nursery",
      },
      {
        name: "param-names",
        category: "style",
      },
      {
        name: "prefer-catch",
        category: "style",
      },
      {
        name: "prefer-await-to-callbacks",
        category: "style",
      },
      {
        name: "prefer-await-to-then",
        category: "style",
      },
      {
        name: "spec-only",
        category: "restriction",
      },
      {
        name: "valid-params",
        category: "correctness",
      },
    ],
  },
  {
    id: "react",
    name: "React",
    isDefault: false,
    rules: [
      {
        name: "button-has-type",
        category: "restriction",
      },
      {
        name: "checked-requires-onchange-or-readonly",
        category: "pedantic",
      },
      {
        name: "exhaustive-deps",
        category: "correctness",
      },
      {
        name: "forbid-dom-props",
        category: "restriction",
      },
      {
        name: "forbid-elements",
        category: "restriction",
      },
      {
        name: "forward-ref-uses-ref",
        category: "correctness",
      },
      {
        name: "iframe-missing-sandbox",
        category: "suspicious",
      },
      {
        name: "jsx-pascal-case",
        category: "style",
      },
      {
        name: "jsx-fragments",
        category: "style",
      },
      {
        name: "jsx-filename-extension",
        category: "restriction",
      },
      {
        name: "jsx-boolean-value",
        category: "style",
      },
      {
        name: "jsx-curly-brace-presence",
        category: "style",
      },
      {
        name: "jsx-handler-names",
        category: "style",
      },
      {
        name: "jsx-key",
        category: "correctness",
      },
      {
        name: "jsx-max-depth",
        category: "style",
      },
      {
        name: "jsx-no-comment-textnodes",
        category: "suspicious",
      },
      {
        name: "jsx-no-duplicate-props",
        category: "correctness",
      },
      {
        name: "jsx-no-script-url",
        category: "suspicious",
      },
      {
        name: "jsx-no-target-blank",
        category: "pedantic",
      },
      {
        name: "jsx-no-undef",
        category: "correctness",
      },
      {
        name: "jsx-no-useless-fragment",
        category: "pedantic",
      },
      {
        name: "jsx-props-no-spread-multi",
        category: "correctness",
      },
      {
        name: "jsx-props-no-spreading",
        category: "style",
      },
      {
        name: "no-did-mount-set-state",
        category: "correctness",
      },
      {
        name: "no-namespace",
        category: "suspicious",
      },
      {
        name: "no-array-index-key",
        category: "perf",
      },
      {
        name: "no-children-prop",
        category: "correctness",
      },
      {
        name: "no-danger-with-children",
        category: "correctness",
      },
      {
        name: "no-danger",
        category: "restriction",
      },
      {
        name: "no-direct-mutation-state",
        category: "correctness",
      },
      {
        name: "no-find-dom-node",
        category: "correctness",
      },
      {
        name: "no-is-mounted",
        category: "correctness",
      },
      {
        name: "no-redundant-should-component-update",
        category: "style",
      },
      {
        name: "no-render-return-value",
        category: "correctness",
      },
      {
        name: "no-set-state",
        category: "style",
      },
      {
        name: "no-string-refs",
        category: "correctness",
      },
      {
        name: "no-this-in-sfc",
        category: "correctness",
      },
      {
        name: "no-unescaped-entities",
        category: "pedantic",
      },
      {
        name: "no-unknown-property",
        category: "restriction",
      },
      {
        name: "no-unsafe",
        category: "correctness",
      },
      {
        name: "no-will-update-set-state",
        category: "correctness",
      },
      {
        name: "only-export-components",
        category: "restriction",
      },
      {
        name: "prefer-es6-class",
        category: "style",
      },
      {
        name: "react-in-jsx-scope",
        category: "suspicious",
      },
      {
        name: "require-render-return",
        category: "nursery",
      },
      {
        name: "rules-of-hooks",
        category: "pedantic",
      },
      {
        name: "self-closing-comp",
        category: "style",
      },
      {
        name: "state-in-constructor",
        category: "style",
      },
      {
        name: "style-prop-object",
        category: "suspicious",
      },
      {
        name: "void-dom-elements-no-children",
        category: "correctness",
      },
    ],
  },
  {
    id: "react-perf",
    name: "React Perf",
    isDefault: false,
    rules: [
      {
        name: "jsx-no-jsx-as-prop",
        category: "perf",
      },
      {
        name: "jsx-no-new-array-as-prop",
        category: "perf",
      },
      {
        name: "jsx-no-new-function-as-prop",
        category: "perf",
      },
      {
        name: "jsx-no-new-object-as-prop",
        category: "perf",
      },
    ],
  },
  {
    id: "typescript",
    name: "TypeScript",
    isDefault: true,
    rules: [
      {
        name: "adjacent-overload-signatures",
        category: "style",
      },
      {
        name: "array-type",
        category: "style",
      },
      {
        name: "ban-ts-comment",
        category: "pedantic",
      },
      {
        name: "ban-tslint-comment",
        category: "style",
      },
      {
        name: "ban-types",
        category: "pedantic",
      },
      {
        name: "consistent-generic-constructors",
        category: "style",
      },
      {
        name: "consistent-indexed-object-style",
        category: "style",
      },
      {
        name: "consistent-type-definitions",
        category: "style",
      },
      {
        name: "consistent-type-imports",
        category: "style",
      },
      {
        name: "explicit-module-boundary-types",
        category: "restriction",
      },
      {
        name: "explicit-function-return-type",
        category: "restriction",
      },
      {
        name: "no-inferrable-types",
        category: "style",
      },
      {
        name: "no-confusing-non-null-assertion",
        category: "suspicious",
      },
      {
        name: "no-duplicate-enum-values",
        category: "correctness",
      },
      {
        name: "no-dynamic-delete",
        category: "restriction",
      },
      {
        name: "no-empty-interface",
        category: "style",
      },
      {
        name: "no-empty-object-type",
        category: "restriction",
      },
      {
        name: "no-explicit-any",
        category: "restriction",
      },
      {
        name: "no-extra-non-null-assertion",
        category: "correctness",
      },
      {
        name: "no-extraneous-class",
        category: "suspicious",
      },
      {
        name: "no-import-type-side-effects",
        category: "restriction",
      },
      {
        name: "no-misused-new",
        category: "correctness",
      },
      {
        name: "no-namespace",
        category: "restriction",
      },
      {
        name: "no-non-null-asserted-nullish-coalescing",
        category: "restriction",
      },
      {
        name: "no-non-null-asserted-optional-chain",
        category: "correctness",
      },
      {
        name: "no-non-null-assertion",
        category: "restriction",
      },
      {
        name: "no-require-imports",
        category: "restriction",
      },
      {
        name: "no-restricted-types",
        category: "restriction",
      },
      {
        name: "no-this-alias",
        category: "correctness",
      },
      {
        name: "no-unnecessary-parameter-property-assignment",
        category: "correctness",
      },
      {
        name: "no-unnecessary-type-constraint",
        category: "suspicious",
      },
      {
        name: "no-unsafe-declaration-merging",
        category: "correctness",
      },
      {
        name: "no-unsafe-function-type",
        category: "pedantic",
      },
      {
        name: "no-useless-empty-export",
        category: "correctness",
      },
      {
        name: "no-var-requires",
        category: "restriction",
      },
      {
        name: "no-wrapper-object-types",
        category: "correctness",
      },
      {
        name: "prefer-as-const",
        category: "correctness",
      },
      {
        name: "prefer-enum-initializers",
        category: "pedantic",
      },
      {
        name: "prefer-for-of",
        category: "style",
      },
      {
        name: "prefer-function-type",
        category: "style",
      },
      {
        name: "prefer-literal-enum-member",
        category: "restriction",
      },
      {
        name: "prefer-namespace-keyword",
        category: "style",
      },
      {
        name: "prefer-ts-expect-error",
        category: "pedantic",
      },
      {
        name: "triple-slash-reference",
        category: "correctness",
      },
    ],
  },
  {
    id: "unicorn",
    name: "Unicorn",
    isDefault: true,
    rules: [
      {
        name: "catch-error-name",
        category: "style",
      },
      {
        name: "consistent-assert",
        category: "pedantic",
      },
      {
        name: "consistent-date-clone",
        category: "style",
      },
      {
        name: "consistent-empty-array-spread",
        category: "pedantic",
      },
      {
        name: "consistent-existence-index-check",
        category: "style",
      },
      {
        name: "consistent-function-scoping",
        category: "suspicious",
      },
      {
        name: "empty-brace-spaces",
        category: "style",
      },
      {
        name: "error-message",
        category: "style",
      },
      {
        name: "escape-case",
        category: "pedantic",
      },
      {
        name: "explicit-length-check",
        category: "pedantic",
      },
      {
        name: "filename-case",
        category: "style",
      },
      {
        name: "new-for-builtins",
        category: "pedantic",
      },
      {
        name: "no-immediate-mutation",
        category: "pedantic",
      },
      {
        name: "no-unnecessary-array-splice-count",
        category: "pedantic",
      },
      {
        name: "no-array-callback-reference",
        category: "pedantic",
      },
      {
        name: "no-useless-collection-argument",
        category: "style",
      },
      {
        name: "no-useless-error-capture-stack-trace",
        category: "restriction",
      },
      {
        name: "no-array-sort",
        category: "suspicious",
      },
      {
        name: "no-array-reverse",
        category: "suspicious",
      },
      {
        name: "no-instanceof-builtins",
        category: "suspicious",
      },
      {
        name: "no-array-method-this-argument",
        category: "style",
      },
      {
        name: "no-unnecessary-array-flat-depth",
        category: "pedantic",
      },
      {
        name: "no-unnecessary-slice-end",
        category: "pedantic",
      },
      {
        name: "no-accessor-recursion",
        category: "suspicious",
      },
      {
        name: "no-invalid-fetch-options",
        category: "correctness",
      },
      {
        name: "no-abusive-eslint-disable",
        category: "restriction",
      },
      {
        name: "no-anonymous-default-export",
        category: "restriction",
      },
      {
        name: "no-array-for-each",
        category: "restriction",
      },
      {
        name: "no-array-reduce",
        category: "restriction",
      },
      {
        name: "no-await-expression-member",
        category: "style",
      },
      {
        name: "no-await-in-promise-methods",
        category: "correctness",
      },
      {
        name: "no-console-spaces",
        category: "style",
      },
      {
        name: "no-document-cookie",
        category: "restriction",
      },
      {
        name: "no-empty-file",
        category: "correctness",
      },
      {
        name: "no-hex-escape",
        category: "pedantic",
      },
      {
        name: "no-instanceof-array",
        category: "pedantic",
      },
      {
        name: "no-invalid-remove-event-listener",
        category: "correctness",
      },
      {
        name: "no-length-as-slice-end",
        category: "restriction",
      },
      {
        name: "no-lonely-if",
        category: "pedantic",
      },
      {
        name: "no-magic-array-flat-depth",
        category: "restriction",
      },
      {
        name: "no-negation-in-equality-check",
        category: "pedantic",
      },
      {
        name: "no-nested-ternary",
        category: "style",
      },
      {
        name: "no-new-array",
        category: "correctness",
      },
      {
        name: "no-new-buffer",
        category: "pedantic",
      },
      {
        name: "no-null",
        category: "style",
      },
      {
        name: "no-object-as-default-parameter",
        category: "pedantic",
      },
      {
        name: "no-process-exit",
        category: "restriction",
      },
      {
        name: "no-single-promise-in-promise-methods",
        category: "correctness",
      },
      {
        name: "no-static-only-class",
        category: "pedantic",
      },
      {
        name: "no-thenable",
        category: "correctness",
      },
      {
        name: "no-this-assignment",
        category: "pedantic",
      },
      {
        name: "no-typeof-undefined",
        category: "pedantic",
      },
      {
        name: "no-unnecessary-await",
        category: "correctness",
      },
      {
        name: "no-unreadable-array-destructuring",
        category: "style",
      },
      {
        name: "no-unreadable-iife",
        category: "pedantic",
      },
      {
        name: "no-useless-fallback-in-spread",
        category: "correctness",
      },
      {
        name: "no-useless-length-check",
        category: "correctness",
      },
      {
        name: "no-useless-promise-resolve-reject",
        category: "pedantic",
      },
      {
        name: "no-useless-spread",
        category: "correctness",
      },
      {
        name: "no-useless-switch-case",
        category: "pedantic",
      },
      {
        name: "no-useless-undefined",
        category: "pedantic",
      },
      {
        name: "no-zero-fractions",
        category: "style",
      },
      {
        name: "number-literal-case",
        category: "style",
      },
      {
        name: "numeric-separators-style",
        category: "style",
      },
      {
        name: "prefer-classlist-toggle",
        category: "style",
      },
      {
        name: "prefer-class-fields",
        category: "style",
      },
      {
        name: "prefer-bigint-literals",
        category: "style",
      },
      {
        name: "prefer-default-parameters",
        category: "style",
      },
      {
        name: "prefer-response-static-json",
        category: "style",
      },
      {
        name: "prefer-top-level-await",
        category: "pedantic",
      },
      {
        name: "prefer-at",
        category: "pedantic",
      },
      {
        name: "prefer-global-this",
        category: "style",
      },
      {
        name: "prefer-keyboard-event-key",
        category: "style",
      },
      {
        name: "prefer-object-from-entries",
        category: "style",
      },
      {
        name: "prefer-array-find",
        category: "perf",
      },
      {
        name: "prefer-array-index-of",
        category: "style",
      },
      {
        name: "prefer-spread",
        category: "style",
      },
      {
        name: "prefer-add-event-listener",
        category: "suspicious",
      },
      {
        name: "prefer-array-flat",
        category: "pedantic",
      },
      {
        name: "prefer-array-flat-map",
        category: "perf",
      },
      {
        name: "prefer-array-some",
        category: "pedantic",
      },
      {
        name: "prefer-blob-reading-methods",
        category: "pedantic",
      },
      {
        name: "prefer-code-point",
        category: "pedantic",
      },
      {
        name: "prefer-date-now",
        category: "pedantic",
      },
      {
        name: "prefer-dom-node-append",
        category: "pedantic",
      },
      {
        name: "prefer-dom-node-dataset",
        category: "pedantic",
      },
      {
        name: "prefer-dom-node-remove",
        category: "pedantic",
      },
      {
        name: "prefer-dom-node-text-content",
        category: "style",
      },
      {
        name: "prefer-event-target",
        category: "pedantic",
      },
      {
        name: "prefer-includes",
        category: "style",
      },
      {
        name: "prefer-logical-operator-over-ternary",
        category: "style",
      },
      {
        name: "prefer-math-min-max",
        category: "pedantic",
      },
      {
        name: "prefer-math-trunc",
        category: "pedantic",
      },
      {
        name: "prefer-modern-dom-apis",
        category: "style",
      },
      {
        name: "prefer-modern-math-apis",
        category: "restriction",
      },
      {
        name: "prefer-native-coercion-functions",
        category: "pedantic",
      },
      {
        name: "prefer-negative-index",
        category: "style",
      },
      {
        name: "prefer-node-protocol",
        category: "restriction",
      },
      {
        name: "prefer-number-properties",
        category: "restriction",
      },
      {
        name: "prefer-optional-catch-binding",
        category: "style",
      },
      {
        name: "prefer-prototype-methods",
        category: "pedantic",
      },
      {
        name: "prefer-query-selector",
        category: "pedantic",
      },
      {
        name: "prefer-reflect-apply",
        category: "style",
      },
      {
        name: "prefer-regexp-test",
        category: "pedantic",
      },
      {
        name: "prefer-set-has",
        category: "perf",
      },
      {
        name: "prefer-set-size",
        category: "correctness",
      },
      {
        name: "prefer-string-raw",
        category: "style",
      },
      {
        name: "prefer-string-replace-all",
        category: "pedantic",
      },
      {
        name: "prefer-string-slice",
        category: "pedantic",
      },
      {
        name: "prefer-string-starts-ends-with",
        category: "correctness",
      },
      {
        name: "prefer-string-trim-start-end",
        category: "style",
      },
      {
        name: "prefer-structured-clone",
        category: "style",
      },
      {
        name: "prefer-type-error",
        category: "pedantic",
      },
      {
        name: "require-module-attributes",
        category: "style",
      },
      {
        name: "require-module-specifiers",
        category: "suspicious",
      },
      {
        name: "require-post-message-target-origin",
        category: "suspicious",
      },
      {
        name: "require-array-join-separator",
        category: "style",
      },
      {
        name: "require-number-to-fixed-digits-argument",
        category: "pedantic",
      },
      {
        name: "switch-case-braces",
        category: "style",
      },
      {
        name: "text-encoding-identifier-case",
        category: "style",
      },
      {
        name: "throw-new-error",
        category: "style",
      },
    ],
  },
  {
    id: "vitest",
    name: "Vitest",
    isDefault: false,
    rules: [
      {
        name: "consistent-each-for",
        category: "correctness",
      },
      {
        name: "consistent-test-filename",
        category: "style",
      },
      {
        name: "consistent-vitest-vi",
        category: "style",
      },
      {
        name: "hoisted-apis-on-top",
        category: "correctness",
      },
      {
        name: "no-conditional-tests",
        category: "correctness",
      },
      {
        name: "no-import-node-test",
        category: "style",
      },
      {
        name: "no-unneeded-async-expect-function",
        category: "style",
      },
      {
        name: "prefer-called-once",
        category: "style",
      },
      {
        name: "prefer-called-times",
        category: "style",
      },
      {
        name: "prefer-describe-function-title",
        category: "style",
      },
      {
        name: "prefer-to-be-falsy",
        category: "style",
      },
      {
        name: "prefer-to-be-object",
        category: "style",
      },
      {
        name: "prefer-to-be-truthy",
        category: "style",
      },
      {
        name: "require-local-test-context-for-concurrent-snapshots",
        category: "correctness",
      },
      {
        name: "warn-todo",
        category: "correctness",
      },
    ],
  },
  {
    id: "vue",
    name: "Vue",
    isDefault: false,
    rules: [
      {
        name: "define-emits-declaration",
        category: "style",
      },
      {
        name: "define-props-declaration",
        category: "style",
      },
      {
        name: "define-props-destructuring",
        category: "style",
      },
      {
        name: "max-props",
        category: "restriction",
      },
      {
        name: "no-arrow-functions-in-watch",
        category: "correctness",
      },
      {
        name: "no-deprecated-destroyed-lifecycle",
        category: "correctness",
      },
      {
        name: "no-export-in-script-setup",
        category: "correctness",
      },
      {
        name: "no-import-compiler-macros",
        category: "restriction",
      },
      {
        name: "no-lifecycle-after-await",
        category: "correctness",
      },
      {
        name: "no-multiple-slot-args",
        category: "restriction",
      },
      {
        name: "no-required-prop-with-default",
        category: "suspicious",
      },
      {
        name: "no-this-in-before-route-enter",
        category: "correctness",
      },
      {
        name: "prefer-import-from-vue",
        category: "correctness",
      },
      {
        name: "require-default-export",
        category: "suspicious",
      },
      {
        name: "require-typed-ref",
        category: "style",
      },
      {
        name: "valid-define-emits",
        category: "correctness",
      },
      {
        name: "valid-define-props",
        category: "correctness",
      },
    ],
  },
];

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
