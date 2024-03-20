import { isInitialised, isSupported } from './common/index.mjs'
import { InitError, SupportError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @internal
 * @abstract
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

    // Mark component as initialised in HTML
    $module?.setAttribute('data-module-init', 'true')
  }

  /**
   * Validates whether component is already initialised
   *
   * @private
   * @param {Element | null} [$module] - HTML element to be checked
   * @throws {InitError} when component is already initialised
   */
  checkInitialised($module) {
    if ($module && isInitialised($module)) {
      throw new InitError($module)
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
