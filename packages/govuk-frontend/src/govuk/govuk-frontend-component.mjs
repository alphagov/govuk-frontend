import { isInitialised, isSupported } from './common/index.mjs'
import { ElementError, InitError, SupportError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @virtual
 * @template {Element} [RootElementType=HTMLElement]
 */
export class GOVUKFrontendComponent {
  /**
   * @type {typeof Element}
   */
  static elementType = HTMLElement

  // allows Typescript user to work around the lack of types
  // in GOVUKFrontend package, Typescript is not aware of $root
  // in components that extend GOVUKFrontendComponent
  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {RootElementType} - the root element of component
   */
  get $root() {
    return this._$root
  }

  /**
   * @protected
   * @type {RootElementType}
   */
  _$root

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
      throw new InitError(`\`moduleName\` not defined in component`)
    }

    if (!($root instanceof childConstructor.elementType)) {
      throw new ElementError({
        element: $root,
        component: childConstructor,
        identifier: 'Root element (`$root`)',
        expectedType: childConstructor.elementType.name
      })
    } else {
      this._$root = /** @type {RootElementType} */ ($root)
    }

    childConstructor.checkSupport()

    this.checkInitialised()

    const moduleName = childConstructor.moduleName

    this.$root.setAttribute(`data-${moduleName}-init`, '')
  }

  /**
   * Validates whether component is already initialised
   *
   * @private
   * @throws {InitError} when component is already initialised
   */
  checkInitialised() {
    const constructor = /** @type {ChildClassConstructor} */ (this.constructor)
    const moduleName = constructor.moduleName

    if (moduleName && isInitialised(this.$root, moduleName)) {
      throw new InitError(constructor)
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
