/** @type {import('eslint').ESLint.Plugin} */
export default {
  meta: {
    name: "local",
    version: "1.0.0",
  },
  rules: {
    "prefer-string-function": {
      meta: {
        type: "suggestion",
        docs: {
          description: "Enforce using String() instead of single-member template expressions.",
        },
        fixable: "code",
        schema: [],
        messages: {
          stringFunction: "Prefer `String()` instead of template expression",
        },
      },
      create(context) {
        return {
          TemplateLiteral(node) {
            if (
              node.expressions.length === 1 &&
              node.quasis.length === 2 &&
              node.quasis.every((quasi) => quasi.value.raw === "")
            ) {
              const expression = node.expressions[0];
              context.report({
                messageId: "stringFunction",
                node,
                fix(fixer) {
                  return [
                    fixer.replaceTextRange([node.range[0], expression.range[0]], "String("),
                    fixer.replaceTextRange([expression.range[1], node.range[1]], ")"),
                  ];
                },
              });
            }
          },
        };
      },
    },
  },
};
