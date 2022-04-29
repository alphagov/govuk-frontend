/**
 * @jest-environment jsdom
 */
/* eslint-env jest */

import ErrorSummary from './error-summary'

const mockErrorSummaryHTML = `
  <div class="govuk-error-summary" data-module="govuk-error-summary"></div>
`

test('adds 1 + 2 to equal 3', () => {
  const error = new ErrorSummary(mockErrorSummaryHTML)
  expect(error.sum()).toBe(4)
})
