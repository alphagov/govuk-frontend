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
 * Indicates that GOV.UK Frontend is not supported
 */
export class SupportError extends GOVUKFrontendError {
  name = 'SupportError'

  /**
   * Checks if GOV.UK Frontend is supported on this page
   *
   * @param {HTMLElement | null} [$scope] - HTML element `<body>` checked for browser support
   */
  constructor($scope = document.body) {
    const supportMessage =
      'noModule' in HTMLScriptElement.prototype
        ? 'GOV.UK Frontend initialised without `<body class="govuk-frontend-supported">` from template `<script>` snippet'
        : 'GOV.UK Frontend is not supported in this browser'

    super(
      $scope
        ? supportMessage
        : 'GOV.UK Frontend initialised without `<script type="module">`'
    )
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
   * @internal
   * @overload
   * @param {string} message - Element error message
   */

  /**
   * @internal
   * @overload
   * @param {ElementErrorOptions} options - Element error options
   */

  /**
   * @internal
   * @param {string | ElementErrorOptions} messageOrOptions - Element error message or options
   */
  constructor(messageOrOptions) {
    let message = typeof messageOrOptions === 'string' ? messageOrOptions : ''

    // Build message from options
    if (typeof messageOrOptions === 'object') {
      const { componentName, identifier, element, expectedType } =
        messageOrOptions

      // Add prefix and identifier
      message = `${componentName}: ${identifier}`

      // Append reason
      message += element
        ? ` is not of type ${expectedType ?? 'HTMLElement'}`
        : ' not found'
    }

    super(message)
  }
}

/**
 * Element error options
 *
 * @internal
 * @typedef {object} ElementErrorOptions
 * @property {string} componentName - The name of the component throwing the error
 * @property {string} identifier - An identifier that'll let the user understand which element has an error. This is whatever makes the most sense
 * @property {Element | null} [element] - The element in error
 * @property {string} [expectedType] - The type that was expected for the identifier
 */
