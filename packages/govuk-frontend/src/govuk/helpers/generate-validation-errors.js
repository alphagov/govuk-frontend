/**
 * Generate an error count, error list and summary for GOV design errors.
 *
 * @param {string} [fieldId] - Field ID
 * @param {string} [text] - Text
 * @param {object} [errors] - Existing validation errors
 * @returns {object} Error count, errorList and summary
 */
const generateValidationErrors = (
  fieldId,
  text,
  errors = { errorList: {}, summary: [] }
) => {
  let summary = [
    {
      text,
      href: `#${fieldId}`
    }
  ]

  if (errors.summary && errors.summary.length) {
    summary = [
      ...errors.summary,
      {
        text,
        href: `#${fieldId}`
      }
    ]
  }

  const keys = Object.keys(errors.errorList ?? {})

  const newLength = keys.length + 1

  const result = {
    count: newLength,
    errorList: {
      ...errors.errorList,
      [fieldId]: {
        text,
        order: newLength
      }
    },
    summary
  }

  return result
}

module.exports = generateValidationErrors
