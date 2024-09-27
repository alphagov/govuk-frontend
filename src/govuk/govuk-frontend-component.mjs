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
    const childConstructor = /** @type {ChildClassConstructor} */ (
      this.constructor
    )

    // TypeScript does not enforce that inheriting classes will define a `moduleName`
    // (even if we add a `@virtual` `static moduleName` property to this class).
    // While we trust users to do this correctly, we do a little check to provide them
    // a helpful error message.
    //
    // After this, we'll be sure that `childConstructor` has a `moduleName`
    // as expected of the `ChildClassConstructor` we've cast `this.constructor` to.
    if (typeof childConstructor.moduleName !== 'string') {
      throw new InitError(childConstructor.moduleName)
    }

    childConstructor.checkSupport()

    this.checkInitialised($root)

    const moduleName = childConstructor.moduleName

    $root?.setAttribute(`data-${moduleName}-init`, '')
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
   * @throws {SupportError} when the components are not supported
   */
  static checkSupport() {
    if (!isSupported()) {
      throw new SupportError()
    }
  }
}

/**
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
 */
