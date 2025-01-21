const { toHaveNoViolations } = require('jest-axe')

/**
 * Checks to see whether a log of Sass warnings contains the specified warning.
 *
 * Example usage:
 * const { compileSassString } = require('@govuk-frontend/helpers/tests')
 * const { sassNull } = require('sass-embedded')
 * const mockWarnFunction = jest.fn().mockReturnValue(sassNull)
 *
 * // within a test
 * await compileSassString(sass, {
 *   logger: { warn: mockWarnFunction }
 * })
 * await expect(mockWarnFunction.mock.calls)
 *   .toHaveSassWarning("The $websafe parameter has been deprecated.")
 *
 * @param {Array} received - The `calls` array of a mock warning function.
 * @param {string} expected - The warning to look for within the array.
 * @returns {object} - Jest match return object.
 */

function toThrowSassWarning(received, expected) {
  if (typeof expected !== 'string') {
    throw new TypeError('Expected warning text must be of type string.')
  }

  let pass = false

  // The result of `mock.calls` is an array of arrays, structured similarly to:
  // [
  //   [
  //     "Text of the warning message",
  //     {
  //       deprecation: false,
  //       stack: "A stack trace (with significant whitespace)"
  //     }
  //   ],
  //   [
  //     "A deprecation message",
  //     {
  //       deprecation: true,
  //       stack: "Another stack trace"
  //     }
  //   ]
  // ]
  //
  //

  // If no warnings were received at all, return false
  if (!Array.isArray(received)) {
    pass = false
  }
  // Loop through and find if any warning in the array matches
  else {
    received.forEach((w) => {
      pass = w[0] === expected
    })
  }

  return {
    message: () =>
      pass
        ? `expected warning not to be found`
        : `expected warning to be found`,
    pass
  }
}

expect.extend(toHaveNoViolations)
expect.extend({ toThrowSassWarning })
