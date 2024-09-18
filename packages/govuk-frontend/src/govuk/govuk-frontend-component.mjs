import { isInitialised, isSupported } from './common/index.mjs'
import { InitError, SupportError, CanInitError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @internal
 * @virtual
 */
export class GOVUKFrontendComponent {
  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   * @param {Element | null} [$module] - HTML element to use for component
   */
  constructor($module) {
    this.checkSupport()
    this.checkInitialised($module)

    const childClassConstructor = /** @type {ChildClassConstructor} */ (
      this.constructor
    )

    const moduleName = childClassConstructor.moduleName
    const canInitialise = childClassConstructor.canInitialise

    if (typeof canInitialise === 'function') {
      if (!canInitialise()) {
        throw new CanInitError('`canInitialise` returned `false`')
      }
    }

    if (typeof moduleName === 'string') {
      moduleName && $module?.setAttribute(`data-${moduleName}-init`, '')
    } else {
      throw new InitError(moduleName)
    }
  }

  /**
   * Validates whether component is already initialised
   *
   * @private
   * @param {Element | null} [$module] - HTML element to be checked
   * @throws {InitError} when component is already initialised
   */
  checkInitialised($module) {
    const moduleName = /** @type {ChildClassConstructor} */ (this.constructor)
      .moduleName

    if ($module && moduleName && isInitialised($module, moduleName)) {
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
 * @property {() => boolean} [canInitialise] - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
 */
