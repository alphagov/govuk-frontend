/**
 * Generate an error count, error list and summary for GOV design summary errors.
 *
 * @param {string} [fieldId] - Field ID
 * @param {string} [text] - Text
 * @param {object} [errors] - Previous validation errors
 * @returns {object} Error count, errorList and summary
 */
const generateValidationError = (
  fieldId,
  text,
  errors = { errorList: {}, summary: [] }
) => {
  const existingErrors = Object.keys(errors.errorList ?? {})
  const totalNewErrors = existingErrors.length + 1

  const errorList = {
    ...errors.errorList,
    [fieldId]: {
      text,
      order: totalNewErrors
    }
  }

  const summary = [
    ...errors.summary,
    {
      text,
      href: `#${fieldId}`
    }
  ]

  return {
    count: totalNewErrors,
    errorList,
    summary
  }
}

module.exports = generateValidationError
