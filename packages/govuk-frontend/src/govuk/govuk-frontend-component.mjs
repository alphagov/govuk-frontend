import { isInitialised, isSupported } from './common/index.mjs'
import { InitError, SupportError } from './errors/index.mjs'

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
   * @type {string|undefined}
   */
  static moduleName
  /**
   * Constructs a new component, validating that GOV.UK Frontend is supported
   *
   * @internal
   * @param {Element | null} [$module] - HTML element to use for component
   */
  constructor($module) {
    this.checkSupport()
    this.checkInitialised($module)

    const moduleName = /** @type {typeof GOVUKFrontendComponent} */ (
      this.constructor
    ).moduleName

    if (typeof moduleName === 'string') {
      moduleName && $module?.setAttribute(`data-${moduleName}-init`, 'true')
    } else {
      throw new InitError(moduleName, this.constructor.name)
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
    const moduleName = /** @type {typeof GOVUKFrontendComponent} */ (
      this.constructor
    ).moduleName

    if ($module && moduleName && isInitialised($module, moduleName)) {
      throw new InitError(moduleName)
    }
  }

  /**
   * Validates whether GOV.UK Frontend is supported
   *
   * @private
   * @throws {SupportError} when GOV.UK Frontend is not supported
   */
  checkSupport() {
    if (!isSupported()) {
      throw new SupportError()
    }
  }
}
