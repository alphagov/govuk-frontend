/**
 * GOV.UK Frontend error
 *
 * A base class for `Error`s thrown by GOV.UK Frontend.
 *
 * It is meant to be extended into specific types of errors
 * to be thrown by our code.
 *
 * @example
 * ```js
 * class MissingRootError extends GOVUKFrontendError {
 *   // Setting an explicit name is important as extending the class will not
 *   // set a new `name` on the subclass. The `name` property is important
 *   // to ensure intelligible error names even if the class name gets
 *   // mangled by a minifier
 *   name = "MissingRootError"
 * }
 * ```
 * @abstract
 */
export class GOVUKFrontendError extends Error {
  name = 'GOVUKFrontendError'
}

/**
 * Indicates that a Component's required HTML element is missing
 */
export class MissingElementError extends GOVUKFrontendError {
  name = 'MissingElementError'
}

/**
 * Indicates that GOV.UK Frontend is not supported
 */
export class SupportError extends GOVUKFrontendError {
  name = 'SupportError'

  // eslint-disable-next-line jsdoc/require-jsdoc -- Nothing pertinent to document
  constructor() {
    super('GOV.UK Frontend is not supported in this browser')
  }
}
