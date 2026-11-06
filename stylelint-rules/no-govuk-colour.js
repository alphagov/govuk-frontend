import stylelint from "stylelint";

const {
  createPlugin,
  utils: { report, ruleMessages, validateOptions }
} = stylelint;

const ruleName = "govuk-frontend/no-govuk-colour";

const messages = ruleMessages(ruleName, {
  rejected: (code) => `Avoid hardcoded colours (\`${code}\`) use govuk-functional-colour instead.`
});

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: primary,
      possible: [true]
    });

    if (!validOptions) return;

    root.walkAtRules((node) => {
      const { params } = node

      if (!params.includes('govuk-colour')) {
        return;
      }

      // If it's within a string or comment, we dont mind.
      if (params.includes("`govuk-colour")) {
        return;
      }

      report({
        result,
        ruleName,
        message: messages.rejected(params),
        node,
        word: "govuk-colour"
      });
    })

    root.walkDecls((node) => {
      const { prop, value } = node
      
      if (!value.includes('govuk-colour')) {
        return;
      }

      // If it's within a string or comment, we dont mind.
      if (value.startsWith("'") && value.endsWith("'")) {
        return;
      }
      
      report({
        result,
        ruleName,
        message: messages.rejected(`${prop}: ${value}`),
        node,
        word: "govuk-colour"
      });
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

export default createPlugin(ruleName, ruleFunction);