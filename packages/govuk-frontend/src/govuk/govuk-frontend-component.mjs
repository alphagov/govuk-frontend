import { isInitialised, isSupported } from './common/index.mjs'
import { InitError, SupportError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @virtual
 */
export class GOVUKFrontendComponent {
  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   * @param {Element | null} [$root] - HTML element to use for component
   */
  constructor($root) {
    this.checkSupport()
    this.checkInitialised($root)

    const moduleName = /** @type {ChildClassConstructor} */ (this.constructor)
      .moduleName

    if (typeof moduleName === 'string') {
      moduleName && $root?.setAttribute(`data-${moduleName}-init`, '')
    } else {
      throw new InitError(moduleName)
    }
  }

  /**
   * Validates whether component is already initialised
   *
   * @private
   * @param {Element | null} [$root] - HTML element to be checked
   * @throws {InitError} when component is already initialised
   */
  checkInitialised($root) {
    const moduleName = /** @type {ChildClassConstructor} */ (this.constructor)
      .moduleName

    if ($root && moduleName && isInitialised($root, moduleName)) {
      throw new InitError(moduleName)
    }
  }

  /**
   * Validates whether components are supported
   *
   * @private
   * @throws {SupportError} when the components are not supported
   */
  checkSupport() {
    if (!this.isSupported()) {
      throw new SupportError()
    }
  }

  /**
   * Defines whether the components are supported
   *
   * @protected
   * @returns {boolean} whether the components are supported
   */
  isSupported() {
    return isSupported()
  }
}

/**
 * @typedef ChildClass
 * @property {string} [moduleName] - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
 */
