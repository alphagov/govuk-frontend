import stylelint from 'stylelint'

function rule(enabled) {
  return (root, result) => {
    // First, we'll validate whether the rule is enabled or not
    // so it behaves like other Stylelint rules
    const validOptions = stylelint.utils.validateOptions(
      result,
      rule.ruleName,
      {
        actual: enabled
      }
    )

    if (!validOptions) {
      return
    }

    root.walkAtRules('include', (atRule) => {
      // As we'll be using regular expressions for checking the parameters
      // we'll first want to be sure we're looking at a `govuk-media-query` call
      if (atRule.params.includes('govuk-media-query')) {
        stylelint.utils.report({
          result,
          ruleName: rule.ruleName,
          message: rule.messages.rejected(),
          node: atRule,
          word: atRule.params
        })
      }
    })
  }
}

rule.ruleName = 'govuk-frontend/prefer-media-query-functions'

rule.messages = stylelint.utils.ruleMessages(rule.ruleName, {
  rejected() {
    return '`govuk-media-query` should not be used, prefer `@media` with `govuk-from-breakpoint` or `govuk-until-breakpoint`'
  }
})

export default rule
