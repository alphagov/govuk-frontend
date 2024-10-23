import Config from './common/config.mjs'
import { isInitialised, isSupported } from './common/index.mjs'
import { normaliseDataset } from './common/normalise-dataset.mjs'
import { ElementError, InitError, SupportError } from './errors/index.mjs'

/**
 * Base Component class
 *
 * Centralises the behaviours shared by our components
 *
 * @virtual
 * @template {Element} [RootElementType=HTMLElement]
 * @template {{[key:string]: unknown}} [ConfigType={}]
 */
export class GOVUKFrontendComponent {
  /**
   * @type {Config<ConfigType> & ConfigType}
   */
  _config

  // allows Typescript user to work around the lack of types
  // in GOVUKFrontend package, Typescript is not aware of $root
  // in components that extend GOVUKFrontendComponent
  /**
   * Returns the root element of the component
   *
   * @protected
   * @returns {Config<ConfigType> & ConfigType} - the root element of component
   */
  get config() {
    return this._config
  }

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
   * @param {...ConfigType} configObjects - Configuration objects for component
   */
  constructor($root, ...configObjects) {
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

    if (configObjects.length) {
      const childConstructorWithConfig =
        /** @type {ChildClassConstructorConfig<ConfigType>} */ (
          this.constructor
        )

      const dataset = /** @type {{ dataset: DOMStringMap }} */ (
        /** @type {unknown} */ (this._$root)
      ).dataset
      const normalisedDataset = /** @type {ConfigType} */ (
        normaliseDataset(childConstructorWithConfig, dataset)
      )

      const configObjectOveride = /** @type {ConfigType} */ (
        childConstructorWithConfig.configOverride(normalisedDataset)
      )

      this._config = /** @type {Config<ConfigType> & ConfigType} */ (
        new Config(
          childConstructor,
          ...configObjects,
          configObjectOveride,
          normalisedDataset
        )
      )
    } else {
      this._config = /** @type {Config<ConfigType> & ConfigType} */ (
        new Config(childConstructor)
      )
    }

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

  /**
   * Override configuration
   *
   * @param {{[key:string]: unknown}} config - config to override
   * @returns {{[key:string]: unknown}} - overidden config
   */
  static configOverride(config) {
    return config
  }
}

/**
 * @typedef ChildClass
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 * @property {Schema} [schema] - The module name that'll be looked for in the DOM when initialising the component
 * @property {{[key:string]: unknown}} [defaults] - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @template {{[key:string]: unknown}} [ConfigType={}]
 * @typedef ChildClassConfig
 * @property {string} moduleName - The module name that'll be looked for in the DOM when initialising the component
 * @property {Schema} schema - The module name that'll be looked for in the DOM when initialising the component
 * @property {{[key:string]: unknown}} defaults - The module name that'll be looked for in the DOM when initialising the component
 */

/**
 * @typedef {typeof GOVUKFrontendComponent & ChildClass} ChildClassConstructor
 */

/**
 * @template {{[key:string]: unknown}} [ConfigType={}]
 * @typedef {typeof GOVUKFrontendComponent & ChildClassConfig<ConfigType>} ChildClassConstructorConfig
 */

/**
 * @typedef {import("./common/index.mjs").Schema} Schema
 */

/**
 * @typedef {import("./common/index.mjs").ObjectNested} ObjectNested
 */
