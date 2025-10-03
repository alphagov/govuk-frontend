import stylelint from 'stylelint'

import govukMediaQueryUseBreakpoints from './rules/govuk-media-query-use-breakpoints.mjs'
import preferMediaQueryFunctions from './rules/prefer-media-query-functions.mjs'

export default [
  stylelint.createPlugin(
    govukMediaQueryUseBreakpoints.ruleName,
    govukMediaQueryUseBreakpoints
  ),
  stylelint.createPlugin(
    preferMediaQueryFunctions.ruleName,
    preferMediaQueryFunctions
  )
]
