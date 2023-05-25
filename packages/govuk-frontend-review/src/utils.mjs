/**
 * To make it easier to use in the view, format express-validator errors.
 *
 * @param {Errors} errors - Validation errors
 * @returns {Record<string, ErrorFormatted> | undefined} Formatted errors
 */
export function formatValidationErrors (errors) {
  return errors
    .formatWith((error) => {
      if (error.type !== 'field') {
        throw new Error(`Unknown error: ${error.type}`)
      }

      return {
        id: error.path,
        href: `#${error.path}`,
        value: error.value,
        text: error.msg
      }
    })
    .mapped()
}

/**
 * GOV.UK Frontend error format
 *
 * @typedef {object} ErrorFormatted
 * @property {string} id - Form field 'id' attribute
 * @property {string} href - Form field 'href' attribute
 * @property {string} value - Form field value (submitted)
 * @property {string} text - Form field error message
 */

/**
 * @typedef {import('express-validator').ValidationError} Error
 * @typedef {import('express-validator').Result<Error>} Errors
 */
