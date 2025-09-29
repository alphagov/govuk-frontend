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
        const usesFromOrUntil = atRule.params.match(/\$(from|until):/)
        const usesPositionalFirstArgument = atRule.params.match(
          /govuk-media-query\(\s*[^$]/
        )

        if (!(usesFromOrUntil || usesPositionalFirstArgument)) {
          stylelint.utils.report({
            result,
            ruleName: rule.ruleName,
            message: rule.messages.rejected(),
            node: atRule,
            word: atRule.params
          })
        }
      }
    })
  }
}

rule.ruleName = 'govuk-frontend/govuk-media-query-use-breakpoints'

rule.messages = stylelint.utils.ruleMessages(rule.ruleName, {
  rejected() {
    return '`govuk-media-query` should use a breakpoint, either with `$from`, `$until` or as first parameter'
  }
})

export default rule
