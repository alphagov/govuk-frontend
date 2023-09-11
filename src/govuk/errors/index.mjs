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

/**
 * Indicates that a component has received an illegal configuration
 */
export class ConfigError extends GOVUKFrontendError {
  name = 'ConfigError'
}

/**
 * Indicates an issue with an element (possibly `null` or `undefined`)
 */
export class ElementError extends GOVUKFrontendError {
  name = 'ElementError'

  /**
   * @param {Element} element - The element in error
   * @param {object} options - options
   * @param {string} options.componentName - The name of the component throwing the error
   * @param {string} options.identifier - An identifier that'll let the user understand which element has an error (variable name, CSS selector)
   * @param {typeof HTMLElement} [options.expectedType] - The type that was expected for the element
   */
  constructor(element, { componentName, identifier, expectedType }) {
    const reason = !element
      ? `${identifier} not found`
      : `${identifier} is not an instance of "${expectedType.name}"`

    super(`${componentName}: ${reason}`)
  }
}
