import stylelint from 'stylelint'

import govukMediaQueryUseBreakpoints from './rules/govuk-media-query-use-breakpoints.mjs'

export default [
  stylelint.createPlugin(
    govukMediaQueryUseBreakpoints.ruleName,
    govukMediaQueryUseBreakpoints
  )
]
